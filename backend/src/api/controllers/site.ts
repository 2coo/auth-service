import cryptoRandomString from 'crypto-random-string'
import { NextFunction, Request, Response } from 'express'
import { some } from 'lodash'
import passport from 'passport'
import { clearCookieTokens, logoutSSO } from '../client'
import { getClientById, saveRememberMeToken } from './utils'

export const login = [
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.body.remember_me) {
      if (req.session.returnTo) return res.redirect(req.session.returnTo)
      return next()
    }
    const token = cryptoRandomString({ length: 64, type: 'url-safe' })
    const savedToken = await saveRememberMeToken(token, req.user.id)
    if (savedToken)
      res.cookie('remember_me', token, {
        path: '/',
        httpOnly: true,
        maxAge: 604800000,
      })
    if (req.session.returnTo) return res.redirect(req.session.returnTo)
    return res.redirect('/')
  },
]

export const logout = async (req: any, res: Response, next: NextFunction) => {
  logoutSSO(req, res)
  clearCookieTokens(res)
  const clientId = req.query.client_id
  const logoutUrl = req.query.logout_url
  if (logoutUrl) {
    let application = req.session.defaultApp
    if (clientId) application = await getClientById(clientId)
    if (!application)
      return res.status(403).json({
        success: false,
        error: 'The application does not exists!',
      })
    if (
      some(application.RedirectUris, {
        url: logoutUrl,
      })
    ) {
      return res.redirect(String(req.query.logout_url))
    } else {
      return res.status(403).json({
        success: false,
        error: 'The logout url not exists on the application.',
      })
    }
  }
  next()
}

import cryptoRandomString from 'crypto-random-string'
import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { saveRememberMeToken } from './utils'

export const login = [
  passport.authenticate('local', {
    // successReturnToOrRedirect: '/account',
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
    console.log('#returnTo', req.session.returnTo)
    if (req.session.returnTo) return res.redirect(req.session.returnTo)
    return res.redirect('/')
  },
]

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout()
  res.clearCookie('remember_me')
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  return res.redirect(`/`)
}

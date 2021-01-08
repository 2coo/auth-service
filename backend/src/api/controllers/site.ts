import queryString from 'querystring'
import cryptoRandomString from 'crypto-random-string'
import { NextFunction, Request, Response } from 'express'
import { some } from 'lodash'
import passport from 'passport'
import { clearCookieTokens, logoutSSO } from '../client'
import { getClientById, saveRememberMeToken } from './utils'
import urlParser from 'url'
import { AccountStatusType, User } from '@prisma/client'

export const login = [
  passport.authenticate('local', { failWithError: true }),
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.body.remember_me) {
      return res.redirect(req.originalUrl)
    }
    const token = cryptoRandomString({ length: 64, type: 'url-safe' })
    const savedToken = await saveRememberMeToken(token, req.user.id)
    if (savedToken)
      res.cookie('remember_me', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 604800000,
      })
    return res.redirect(req.originalUrl)
  },
  (err: any, req: any, res: Response, next: NextFunction) => {
    const parsedUrl = urlParser.parse(req.url)
    const query = req.query
    if (err.message) {
      query['error'] = Buffer.from(err.message).toString('base64')
      parsedUrl.query = queryString.stringify(query)
      parsedUrl.search = `?${queryString.stringify(query)}`
    }
    const redirectUrl = urlParser.format(parsedUrl)
    // Handle error
    if (req.xhr) {
      return res.json(err)
    }
    return res.redirect(redirectUrl)
  },
]

export const logout = async (req: any, res: Response, next: NextFunction) => {
  logoutSSO(req, res)
  clearCookieTokens(res)
  res.clearCookie('remember_me')
  const clientId = req.query.client_id
  const logoutUrl = req.query.logout_url
  if (logoutUrl) {
    let application = req.session.defaultApp
    if (clientId) application = await getClientById(clientId)
    if (!application)
      return res.status(403).json({
        success: false,
        message: 'The application does not exists!',
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
        message: 'The logout url not exists on the application.',
      })
    }
  }
  next()
}

export const validate_email = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as User
  if (user.accountStatusType === AccountStatusType.UNCONFIRMED) {
    //to do send email
  }
  return res.json({
    success: true,
    data: {
      email: user.email,
      is_verified: user.accountStatusType === AccountStatusType.CONFIRMED,
      is_email_sent: true
    },
  })
}

export const verify_code = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // req.query.code verify code
  return res.json({
    success: true,
    data: {
      verified: true
    }
  })
}

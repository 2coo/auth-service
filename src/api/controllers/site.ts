'use strict'

import passport from 'passport'
import celogin from 'connect-ensure-login'
import { Request, Response, NextFunction } from 'express'
import { SystemUser } from '@prisma/client'
import { ensureLoginWithPoolIdentifier } from '../utils'
import queryString from 'query-string'

export const index = (req: Request, res: Response) => {
  if (!req.query.code) {
    res.send('OAuth 2.0 Server <br/> <a href="account">Account</a>')
  } else {
    res.render('index-with-code')
  }
}

export const loginForm = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.redirect(`/${req.params.userPoolIdentifier}/account`)
  }
  return res.render('login')
}

export const login = [
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        const queryParams = queryString.parse(req.session!.returnTo)
        if (queryParams.redirect_uri)
          return res
            .status(401)
            .redirect(`${queryParams.redirect_uri}?error=access_denied`)
        else
          return res.status(401).json({
            message: 'User not found!',
          })
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err)
        }        
        if (req.session?.returnTo === '/' || !req.session!.returnTo) {
          return res.redirect(`/${req.params.userPoolIdentifier}/account`)
        } else {
          return res.redirect(req.session!.returnTo)
        }
      })
    })(req, res, next)
  },
]

export const logout = (req: Request, res: Response) => {
  req.logout()
  res.redirect(`/${req.params.userPoolIdentifier}/`)
}

export const account = [
  ensureLoginWithPoolIdentifier(),
  (req: Request, res: Response) => res.render('account', { user: req.user }),
]

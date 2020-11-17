'use strict'

import passport from 'passport'
import celogin, { ensureLoggedIn } from 'connect-ensure-login'
import { Request, Response, NextFunction } from 'express'
import { SystemUser } from '@prisma/client'

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
    res.redirect(`/account`)
  }
  return res.render('login')
}

export const login = [
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req: Request, res: Response, next: NextFunction) {
    res.redirect(req.session.returnTo)
  },
]

export const logout = (req: Request, res: Response) => {
  req.logout()
  return res.redirect(`/`)
}

export const account = [
  ensureLoggedIn(),
  (req: Request, res: Response) => res.render('account', { user: req.user }),
]

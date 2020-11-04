'use strict'

import passport from 'passport'
import celogin from 'connect-ensure-login'
import { Request, Response, NextFunction } from 'express'
import { SystemUser } from '@prisma/client'

export const index = (req: Request, res: Response) =>
  res.send('OAuth 2.0 Server <br/> <a href="/account/">Account</a>')

export const loginForm = (req: Request, res: Response) => {
  const user = req.user as SystemUser
  if (req.isAuthenticated()) {
    res.redirect(`/account/`)
  }
  return res.render('login')
}

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      })
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }

      if (req.session?.returnTo === '/') return res.redirect('/account/')
      else {
        return res.redirect(req.session!.returnTo)
      }
    })
  })(req, res, next)
}

export const logout = (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
}

export const account = [
  celogin.ensureLoggedIn(),
  (req: Request, res: Response) => res.render('account', { user: req.user }),
]

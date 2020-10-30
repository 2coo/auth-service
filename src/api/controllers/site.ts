'use strict'

import passport from 'passport'
import celogin from 'connect-ensure-login'
import { Request, Response, NextFunction } from 'express'

export const index = (request: Request, response: Response) =>
  response.send('OAuth 2.0 Server')

export const loginForm = (request: Request, response: Response) =>
  response.render('login')

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
      return res.redirect('/users/' + user.email)
    })
  })(req, res, next)
}

export const logout = (request: Request, response: Response) => {
  request.logout()
  response.redirect('/')
}

export const account = [
  celogin.ensureLoggedIn(),
  (request: Request, response: Response) =>
    response.render('account', { user: request.user }),
]

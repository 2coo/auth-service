'use strict'

import * as passport from 'passport'
import * as celogin from 'connect-ensure-login'

export const index = (request: any, response: any) =>
  response.send('OAuth 2.0 Server')

export const loginForm = (request: any, response: any) =>
  response.render('login')

export const login = passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
})

export const logout = (request: any, response: any) => {
  request.logout()
  response.redirect('/')
}

export const account = [
  celogin.ensureLoggedIn(),
  (request: any, response: any) =>
    response.render('account', { user: request.user }),
]

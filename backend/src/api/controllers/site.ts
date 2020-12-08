import { NextFunction, Request, Response } from 'express'
import passport from 'passport'

export const login = [
  passport.authenticate('local', {
    successReturnToOrRedirect: '/account',
    failureRedirect: '/login',
  }),
]

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout()
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  return res.redirect(`/`)
}

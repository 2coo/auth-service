import { Profile, User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import passport from 'passport'

export const userinfo = [
  passport.authenticate('jwt', {
    session: false,
    scope: ['email', 'profile'],
  }),
  (req: any, res: Response, next: NextFunction) => {
    const user: User = req.user
    const profile: Profile = req.user.Profile
    return res.json({
      success: true,
      data: {
        sub: user.id,
        name: profile.displayName,
        given_name: profile.firstName,
        family_name: profile.lastName,
        preferred_username: user.username,
        email: user.email,
        picture: profile.picture,
      },
    })
  },
]

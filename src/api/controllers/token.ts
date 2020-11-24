import { Request, Response } from 'express'
import passport from 'passport'
import { prisma } from '../../context'

export const revoke = [
  passport.authenticate(['basic', 'clientPassword'], {
    session: false,
    passReqToCallback: true,
  }),
  async (req: Request, res: Response, next: Function) => {
    try {
      await prisma.oAuthRefreshToken.delete({
        where: {
          refreshToken: req.body.refresh_token,
        },
      })
      return res.json({
        success: true,
        message: 'Successfully revoked.',
      })
    } catch (err) {
      return res.status(500).json({
        message: err,
      })
    }
  },
]

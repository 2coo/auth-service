import { Request, Response, NextFunction } from 'express'
import * as passport from 'passport'
import { prisma } from '../../context'
import * as fs from 'fs'
import * as jose from 'node-jose'

export const revoke = [
  passport.authenticate(['basic', 'clientPassword'], {
    session: false,
    passReqToCallback: true,
  }),
  async (req: Request, res: Response, next: Function) => {
    try {
      await prisma.refreshToken.delete({
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

export const jwks = async (req: Request, res: Response, next: NextFunction) => {
  const ks = fs.readFileSync(`${__dirname}/../../keys/jwks.json`)
  const keyStore = await jose.JWK.asKeyStore(ks.toString())
  res.json(keyStore.toJSON())
}

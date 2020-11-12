import moment from 'moment-timezone'
import { Request, Response } from 'express'
import { validateAccessTokenExpiration } from './../validate'
import { prisma } from '../../context'

export const info = async (req: Request, res: Response, next: Function) => {
  console.log('#infotoken')

  try {
    const accessToken = await validateAccessTokenExpiration(
      req.params!.access_token,
      req.params.userPoolIdentifier,
    )
    const now = moment()
    const diff = moment
      .duration(moment.parseZone(accessToken.expirationDate).diff(now))
      .asMinutes()
    return res.json({
      audience: accessToken.Client.id,
      expires_in: diff * 60,
      scope: accessToken.Scopes.map((scope) => scope.name).join(' '),
    })
  } catch (err) {
    res.status(400).json({
      message: String(err),
    })
  }
}

export const revoke = async (req: Request, res: Response, next: Function) => {
  try {
    await prisma.oAuthAccessToken.delete({
      where: {
        accessToken: req.params!.access_token,
      },
    })
    return res.json({
      message: 'Successfully revoked.',
    })
  } catch (err) {
    return res.json({
      message: err,
    })
  }
}

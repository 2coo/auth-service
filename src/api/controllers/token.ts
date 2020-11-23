import moment from 'moment-timezone'
import { Request, Response } from 'express'
import { prisma } from '../../context'
import { getAccessToken } from './utils'

export const info = async (req: Request, res: Response, next: Function) => {
  try {
    const accessToken = await getAccessToken(req.params!.jti)
    if (!accessToken) throw Error('AccessToken not found!')
    const now = moment()
    const diff = moment
      .duration(moment.parseZone(accessToken.expirationDate).diff(now))
      .asMinutes()
    return res.json({
      audience: accessToken.Client.id,
      expires_in: diff * 60,
      scope: accessToken.Scopes.map((scope: any) => scope.name).join(' '),
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
        jti: req.params!.jti,
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

import { packRules } from '@casl/ability/extra'
import { AccountStatusType } from '@prisma/client'
import { NextFunction, Response } from 'express'
import * as moment from 'moment'
import * as passport from 'passport'
import { getRulesForUser } from '../../core/authorization'
import { OpenIDStandardClaims } from '../../core/interfaces/OpenID'
import { getUserApplicationRoles, getUserById } from './utils'

export const userinfo = [
  passport.authenticate('jwt', {
    session: false,
    scope: ['openid'],
  }),
  async (req: any, res: Response, next: NextFunction) => {
    const appId = req.session.client_id
    const scopes: string[] = req.session.scope
    const user = await getUserById(req.user.id)
    if (!user)
      return res.status(401).json({
        success: false,
        message: 'The user does not exists!',
      })
    const profile = user.Profile

    const data: OpenIDStandardClaims = {
      sub: user.id,
      ...(scopes.indexOf('email') > -1 && {
        email: user.email,
        email_verified: user.accountStatusType === AccountStatusType.CONFIRMED,
      }),
      ...(scopes.includes('profile')
        ? {
            name: profile?.displayName,
            family_name: profile?.lastName,
            given_name: profile?.firstName,
            middle_name: profile?.middleName,
            nickname: profile?.nickName,
            picture: profile?.picture,
            birthdate:
              profile?.birthdate &&
              moment.parseZone(profile.birthdate).format(),
            updated_at: profile?.updatedAt.toISOString(),
            preferred_username: user.username,
          }
        : {}),
    }
    return res.json({
      success: true,
      data,
    })
  },
]

export const abilities = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const rules = await getRulesForUser(req)
  return res.json({
    success: true,
    data: {
      rules: packRules(rules),
    },
  })
}

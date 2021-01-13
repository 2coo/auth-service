import { packRules } from '@casl/ability/extra'
import { NextFunction, Response } from 'express'
import * as moment from 'moment'
import * as passport from 'passport'
import { getRulesForUser } from '../../core/authorization'
import { OpenIDStandardClaims } from '../../core/interfaces/OpenID'
import {
  getUserApplicationRoles,
  getUserById
} from './utils'

export const userinfo = [
  passport.authenticate('jwt', {
    session: false,
    scope: ['email', 'profile'],
  }),
  async (req: any, res: Response, next: NextFunction) => {
    const appId = req.session.client_id
    const user = await getUserById(req.user.id)
    if (!user)
      return res.status(401).json({
        success: false,
        message: 'The user does not exists!',
      })
    const profile = user.Profile
    const data: OpenIDStandardClaims & {
      roles: string[]
    } = {
      sub: user.id,
      roles: getUserApplicationRoles(user, appId).map((role) => role.name),
      ...(profile && {
        name: profile.displayName,
        gender: profile.gender,
        birthdate:
          profile.birthdate && moment.parseZone(profile.birthdate).format(),
        family_name: profile.lastName,
        given_name: profile.firstName,
        picture: profile.picture,
        preferred_username: user.username,
        groups: user.Groups.map((group) => group.name),
      }),
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

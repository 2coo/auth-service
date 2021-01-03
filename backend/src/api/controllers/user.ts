import {
  Application,
  RedirectURI,
  Scope,
  SelfRegistrationFields,
} from '@prisma/client'
import { NextFunction, Response } from 'express'
import moment from 'moment'
import passport from 'passport'
import { OpenIDStandardClaims } from '../../core/interfaces/OpenID'
import { getClientById, getUserApplicationRoles, getUserById } from './utils'
import { packRules } from '@casl/ability/extra'
import { getRulesForUser } from '../../core/authorization'

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

export const fields = async (req: any, res: Response, next: NextFunction) => {
  let application:
    | (Application & {
        EnabledScopes?: Scope[] | undefined
        SelfRegistrationFields?: SelfRegistrationFields[] | undefined
        RedirectUris?: RedirectURI[] | undefined
      })
    | null = req.session.defaultApp
  if (req.query.client_id) {
    application = await getClientById(req.query.client_id, {
      EnabledScopes: true,
      RedirectUris: true,
      SelfRegistrationFields: true,
    })
    if (!application)
      return res.status(403).json({
        success: false,
        error: 'The application does not exists!',
      })
  }
  if (application?.selfRegistrationEnabled) {
    return res.json({
      success: true,
      data: {
        fields: application!
          .SelfRegistrationFields!.filter((field) => field.isEnabled)
          .map((field) => ({
            name: field.fieldName,
            type: field.fieldType,
            is_required: field.isRequired,
          })),
      },
    })
  } else {
    return res.status(403).json({
      success: false,
      error: 'The application is not enabled self-registration!',
    })
  }
}

export const register = (req: any, res: Response, next: NextFunction) => {
  next()
}

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

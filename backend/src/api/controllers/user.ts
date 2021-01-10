import {
  Application,
  RedirectURI,
  Scope,
  SelfRegistrationFields,
  Tenant,
} from '@prisma/client'
import { NextFunction, Response, Request } from 'express'
import moment from 'moment'
import passport from 'passport'
import { OpenIDStandardClaims } from '../../core/interfaces/OpenID'
import {
  getClientById,
  getUserApplicationRoles,
  getUserById,
  registerUser,
} from './utils'
import queryString from 'query-string'
import { packRules } from '@casl/ability/extra'
import { getRulesForUser } from '../../core/authorization'
import { uniq } from 'lodash'

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
    | null = await getClientById(req.session.defaultApp.id, {
    EnabledScopes: true,
    RedirectUris: true,
    SelfRegistrationFields: true,
  })
  if (req.query.client_id) {
    application = await getClientById(req.query.client_id, {
      EnabledScopes: true,
      RedirectUris: true,
      SelfRegistrationFields: true,
    })
    if (!application)
      return res.status(403).json({
        success: false,
        message: 'The application does not exists!',
      })
  }
  if (application?.selfRegistrationEnabled) {
    return res.json({
      success: true,
      data: {
        fields: application
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
      message: 'The application is not enabled self-registration!',
    })
  }
}

export const register = async (
  req: Request & {
    session: any
  },
  res: Response,
  next: NextFunction,
) => {
  const { email, password, fullname } = req.body
  let application = (await getClientById(req.session.defaultApp.id, {
    Tenant: true,
  })) as Application & {
    Tenant: Tenant
  }
  console.log(req.query.client_id)
  if (req.query.client_id) {
    application = (await getClientById(String(req.query.client_id), {
      Tenant: true,
    })) as Application & {
      Tenant: Tenant
    }
  }
  if (!application) {
    return res.json({
      success: false,
      message: 'The application does not exits!',
    })
  }
  const user = await registerUser({
    data: {
      email,
      password,
      fullname,
    },
    applications: uniq([req.session.defaultApp.id, application.id]),
    tenantId: req.session.tenant.id,
  })
  req.login(user, function (err) {
    if (err) {
      return next(err)
    }
    if (req.xhr) {
      return res.json({
        success: true,
        message: 'Successfully registered.',
      })
    } else {
      return res.redirect(
        `/oauth2/authorize?${queryString.stringify(req.query as any)}`,
      )
    }
  })
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

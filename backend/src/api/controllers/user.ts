import {
  Application,
  Profile,
  RedirectURI,
  Scope,
  SelfRegistrationFields,
  User,
} from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { getClient, getClientById } from './utils'

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

export const fields = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  let application:
    | (Application & {
        EnabledScopes: Scope[]
        SelfRegistrationFields: SelfRegistrationFields[]
        RedirectUris: RedirectURI[]
      })
    | null = req.session.defaultApp
  if (req.query.client_id) {
    application = await getClientById(req.query.client_id)
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
        fields: application.SelfRegistrationFields.filter(
          (field) => field.isEnabled,
        ).map((field) => ({
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

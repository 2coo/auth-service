import {
  AccountStatusType,
  Application,
  RedirectURI,
  Scope,
  SelfRegistrationField,
  Tenant,
  User
} from '@prisma/client'
import * as cryptoRandomString from 'crypto-random-string'
import { NextFunction, Request, Response } from 'express'
import { some, uniq } from 'lodash'
import * as passport from 'passport'
import * as queryString from 'query-string'
import * as urlParser from 'url'
import Queue from '../../lib/Queue'
import { clearCookieTokens, logoutSSO } from '../client'
import {
  generateResetPasswordToken,
  generateVerificationCode,
  getClientById,
  getUserByUsernameOrEmail,
  registerUser,
  saveRememberMeToken,
  verifyCode,
  verifyTokenAndUpdatePassword
} from './utils'

export const login = [
  passport.authenticate('local', { failWithError: true }),
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.body.remember_me) {
      return res.redirect(req.originalUrl)
    }
    const token = cryptoRandomString({ length: 64, type: 'url-safe' })
    const savedToken = await saveRememberMeToken(token, req.user.id)
    if (savedToken)
      res.cookie('remember_me', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 604800000,
      })
    return res.redirect(req.originalUrl)
  },
  (err: any, req: any, res: Response, next: NextFunction) => {
    const parsedUrl = urlParser.parse(req.url)
    const query = req.query
    if (err.message) {
      query['error'] = Buffer.from(err.message).toString('base64')
      parsedUrl.query = queryString.stringify(query)
      parsedUrl.search = `?${queryString.stringify(query)}`
    }
    const redirectUrl = urlParser.format(parsedUrl)
    // Handle error
    if (req.xhr) {
      return res.json(err)
    }
    return res.redirect(redirectUrl)
  },
]

export const logout = async (req: any, res: Response, next: NextFunction) => {
  logoutSSO(req, res)
  clearCookieTokens(res)
  res.clearCookie('remember_me')
  const clientId = req.query.client_id
  const logoutUrl = req.query.logout_url
  if (logoutUrl) {
    let application = req.session.defaultApp
    if (clientId) application = await getClientById(clientId)
    if (!application)
      return res.status(403).json({
        success: false,
        message: 'The application does not exists!',
      })
    if (
      some(application.RedirectUris, {
        url: logoutUrl,
      })
    ) {
      return res.redirect(String(req.query.logout_url))
    } else {
      return res.status(403).json({
        success: false,
        message: 'The logout url not exists on the application.',
      })
    }
  }
  next()
}

export const fields = async (req: any, res: Response, next: NextFunction) => {
  let application:
    | (Application & {
        EnabledScopes?: Scope[] | undefined
        SelfRegistrationFields?: SelfRegistrationField[] | undefined
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

export const validate_email = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as User
  if (user.accountStatusType === AccountStatusType.UNCONFIRMED) {
    const verificationCode = await generateVerificationCode(4, user.id)
    await Queue.add('VerificationMail', { user, code: verificationCode.code })
  }
  return res.json({
    success: true,
    data: {
      email: user.email,
      is_verified: user.accountStatusType === AccountStatusType.CONFIRMED,
      is_email_sent: true,
    },
  })
}

export const verify_code = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const code = req.body.code
  const user_id = (req.user as User).id
  const verified = await verifyCode(code, user_id)
  if (verified)
    return res.json({
      success: true,
      data: {
        verified,
      },
    })
  else
    return res.status(500).json({
      success: false,
      message:
        'Oops! The verification code you entered is incorrect! Please try again!',
      data: {
        verified,
      },
    })
}

export const forgot = async (req: any, res: Response, next: NextFunction) => {
  const email = req.body.email
  console.log('#email', email)

  const user = await getUserByUsernameOrEmail(email)
  if (!user) {
    return res.status(403).json({
      success: false,
      message: 'This email does not exist in our system!',
    })
  }
  const token = await generateResetPasswordToken(
    user.id,
    req.originalUrl || req.url,
  )
  await Queue.add('ResetPasswordMail', { email, token })
  return res.json({
    success: true,
    message: 'Recovery link sent.',
    data: {
      is_sent: true,
    },
  })
}

export const reset = async (req: any, res: Response, next: NextFunction) => {
  const { token, password } = req.body
  try {
    const newPasswordToken = await verifyTokenAndUpdatePassword(token, password)
    req.login(newPasswordToken.User, (err: any) => {
      if (err) {
        return next(err)
      }
      const returnTo = newPasswordToken.returnTo
      const queryParsedString =
        returnTo.indexOf('?') > -1
          ? returnTo.substr(returnTo.indexOf('?'), returnTo.length)
          : ''
      if (req.xhr) {
        return res.json({
          success: true,
          message: 'Successfully changed.',
          data: {
            returnTo: `/oauth2/authorize${queryParsedString}`,
          },
        })
      } else {
        return res.redirect(`/oauth2/authorize?${queryParsedString}`)
      }
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

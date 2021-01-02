import { Application, Scope } from '@prisma/client'
import Axios from 'axios'
import { NextFunction, Response } from 'express'
import jwt, { VerifyOptions } from 'jsonwebtoken'
import jwksClient, { JwksClient } from 'jwks-rsa'
import passport from 'passport'
import { Strategy as CustomStrategy } from 'passport-custom'
import path from 'path'
import { prisma } from '../../context'
import { getDefaultApplicationByTenant } from '../controllers/utils'
import { Payload } from './../../core/interfaces/Payload'

export class JWTScopeStrategy extends CustomStrategy {
  authenticate(req: any, options: any) {
    req.scope = options.scope
    return super.authenticate(req, options)
  }
}

type ApplicationWithRedirectUris = Application & {
  EnabledScopes: Array<Scope>
}

export const loggerMiddleware = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  console.log(
    '#ON:',
    `[${req.method}]\t`,
    req.url + '\t',
    req.url === '/oauth2/token' ? `(GRANT_TYPE: ${req.body.grant_type})` : '',
  )
  next()
}

export const tenantAndDefaultAppMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const tenantDomain = req.vhost[0] === undefined ? '*' : req.vhost[0]
  const tenant = await prisma.tenant.findUnique({
    where: {
      domainName: tenantDomain,
    },
  })
  if (!tenant) {
    return res.send(`The "${tenantDomain}" tenant not found!`)
  }
  const defaultApp = await getDefaultApplicationByTenant(tenant.id)
  req.session.defaultApp = defaultApp
  next()
}

export const redirectWithApp = (
  app: ApplicationWithRedirectUris,
  res: Response,
  route: string = '/oauth2/authorize',
) => {
  const redirectTo = defaultLinkBuilder(app, route)
  return res.redirect(redirectTo)
}

export const verifyAppOrRedirect = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  if (!req.query.client_id) {
    const defaultApp: ApplicationWithRedirectUris = req.session.defaultApp
    return redirectWithApp(defaultApp, res, req.route.path)
  }
  next()
}

export const verifySSO = (
  options?:
    | string
    | {
        redirectTo?: string
        setReturnTo?: boolean
      },
) => {
  if (typeof options == 'string') {
    options = { redirectTo: options }
  }
  options = options || {}
  var url = options.redirectTo || '/oauth2/authorize'
  var setReturnTo =
    options.setReturnTo === undefined ? true : options.setReturnTo
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      clearCookieTokens(res)
      logoutSSO(req, res)
      const defaultApp: ApplicationWithRedirectUris = req.session.defaultApp
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return redirectWithApp(defaultApp, res, url)
    }
    next()
  }
}

export const clearCookieTokens = (res: Response) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
}

export const logoutSSO = (req: any, res: Response) => {
  req.logout()
  res.clearCookie('remember_me')
}

export const verifyCookieTokens = passport.authenticate('jwt', {
  session: false,
  scope: ['openid', 'email', 'profile'],
})

export const getKIDfromAccessToken = (accessToken: string) => {
  const tokenSections = accessToken.split('.')
  if (tokenSections.length < 2) {
    throw new Error('requested token is invalid')
  }
  const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8')
  const header = JSON.parse(headerJSON)
  return header.kid
}

export const renderSPA = (req: any, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, '../../../build', 'index.html'))
}

export const defaultLinkBuilder = (
  defaultApp: Application & { EnabledScopes: Array<Scope> },
  route: string,
) => {
  const scopes = defaultApp.EnabledScopes.map((scope) => scope.name).join('%20')
  const failureRedirect = `${route}?response_type=code&redirect_uri=/oauth2/authorize&client_id=${defaultApp.id}&scope=${scopes}`
  return failureRedirect
}

export const verifyJWT = async (
  client: JwksClient,
  accessToken: string,
  issuer: string | null = null,
  audience: string | null = null,
) => {
  const kid = getKIDfromAccessToken(accessToken)
  const key = await client.getSigningKeyAsync(kid)
  let payload: Payload
  const options: VerifyOptions = {
    algorithms: ['RS256'],
    ...(issuer && {
      issuer,
    }),
    ...(audience && {
      audience,
    }),
  }
  payload = jwt.verify(accessToken, key.getPublicKey(), options) as Payload
  return payload
}

export const grantTypeCodeHandler = (returnTo: string = '/app') => async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const defaultApp: Application = req.session.defaultApp
  const host = req.protocol + '://' + req.get('host')
  const { code } = req.query
  if (code) {
    const basicAuth = Buffer.from(
      `${defaultApp.id}:${defaultApp.secret}`,
    ).toString('base64')
    const tokens = (
      await Axios.post(
        `${host}/oauth2/token`,
        {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: '/oauth2/authorize',
        },
        {
          headers: {
            Authorization: `Basic ${basicAuth}`,
          },
        },
      )
    ).data
    if (tokens.access_token) {
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        sameSite: true,
      })
    }
    if (tokens.refresh_token) {
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        sameSite: true,
      })
    }
    if (tokens.id_token) {
      res.cookie('id_token', tokens.id_token, {
        httpOnly: true,
        sameSite: true,
      })
    }
    return res.redirect(returnTo)
  }
  return next()
}

export const grantTypeRefreshHandler = (returnTo: string = '/app') => async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const defaultApp: Application = req.session.defaultApp
  const host = req.protocol + '://' + req.get('host')

  const jwks_client = jwksClient({
    cache: true,
    rateLimit: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 10000,
    jwksUri: `${host}/.well-known/jwks.json`,
  })
  const access_token = req.cookies['access_token']
  const refresh_token = req.cookies['refresh_token']
  const id_token = req.cookies['id_token']
  if (access_token && refresh_token && id_token) {
    try {
      const decoded = await verifyJWT(
        jwks_client,
        req.cookies.access_token,
        defaultApp.id,
        defaultApp.issuer,
      )
      console.log('\tJWT is currently active.')
      return res.redirect(returnTo)
    } catch (err) {
      try {
        const basicAuth = Buffer.from(
          `${defaultApp.id}:${defaultApp.secret}`,
        ).toString('base64')
        const tokens = (
          await Axios.post(
            `${host}/oauth2/token`,
            {
              grant_type: 'refresh_token',
              refresh_token: req.cookies.refresh_token,
            },
            {
              headers: {
                Authorization: `Basic ${basicAuth}`,
              },
            },
          )
        ).data
        res.cookie('access_token', tokens.access_token, {
          httpOnly: true,
          sameSite: true,
        })
        return res.redirect(returnTo)
      } catch (err2) {
        console.log('\t', err2)
        clearCookieTokens(res)
        logoutSSO(req, res)
      }
    }
  }
  return next()
}

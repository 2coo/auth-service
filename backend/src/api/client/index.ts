import queryString from 'querystring'
import jwksClient, { JwksClient } from 'jwks-rsa'
import { Application, Scope } from '@prisma/client'
import Axios from 'axios'
import { NextFunction, Response } from 'express'
import passport from 'passport'
import path from 'path'
import jwt from 'jsonwebtoken'

export const ensureLoggedInWithCookie = () => async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const defaultApp: Application & {
    EnabledScopes: Array<Scope>
  } = req.session.defaultApp
  const failureRedirect = defaultLinkBuilder(defaultApp)
  return passport.authenticate('jwt', {
    session: false,
    scope: ['openid', 'email', 'profile'],
    successRedirect: '/app',
    failureRedirect: failureRedirect,
  })(req, res, next)
}

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
) => {
  const scopes = defaultApp.EnabledScopes.map((scope) => scope.name).join(' ')
  const failureRedirect = `/oauth2/authorize?response_type=code&redirect_uri=/oauth2/authorize&client_id=${defaultApp.id}&scope=${scopes}`
  return failureRedirect
}

export const removeCookieIfSSOisLoggedOut = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  if (
    !req.isAuthenticated() ||
    (!req.cookies.access_token && !req.cookies.refresh_token)
  ) {
    return res.redirect('/logout')
  }
  next()
}

export const verifyJWT = async (
  client: JwksClient,
  accessToken: string,
  applicationId: string,
  issuer: string,
) => {
  const kid = getKIDfromAccessToken(accessToken)
  const key = await client.getSigningKeyAsync(kid)
  const payload: any = jwt.verify(accessToken, key.getPublicKey(), {
    algorithms: ['RS256'],
    audience: applicationId,
    issuer,
  })
  return payload
}

export const grantTypeCode = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const defaultApp: Application = req.session.defaultApp
  const host = req.protocol + '://' + req.get('host')
  const { code } = req.query
  if (code) {
    console.log("#code", code);
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
        sameSite: 'strict'
      })
    }
    if (tokens.refresh_token) {
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        sameSite: 'strict'
      })
    }
    return res.redirect('/login')
  }
  return next()
}

export const grantTypeRefresh = async (
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
  if (access_token && refresh_token) {
    console.log("#access_token", access_token);
    console.log("#refresh_token", refresh_token);
    try {
      const decoded = await verifyJWT(
        jwks_client,
        req.cookies.access_token,
        defaultApp.id,
        defaultApp.issuer,
      )
      console.log('#returnTo', req.query.returnTo)
      if (
        req.session.returnTo !== undefined &&
        req.session.returnTo !== req.route.path
      ) {
        return res.redirect(req.query.returnTo)
      }
      return res.redirect('/app')
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
        })
        if (req.session.returnTo && req.session.returnTo !== req.route.path) {
          return res.redirect(req.query.returnTo)
        }
        return res.redirect('/app')
      } catch (err2) {
        console.log(err2)
        req.logout()
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        // req.session.reset()
      }
    }
  }
  return next()
}

export const authCodeCallback = [grantTypeCode, grantTypeRefresh]

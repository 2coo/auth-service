import { AccountStatusType, Application, User } from '@prisma/client'
import { compare } from 'bcryptjs'
import * as cryptoRandomString from 'crypto-random-string'
import * as jwt from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'
import * as passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password'
import { Strategy as RememberMeStrategy } from 'passport-remember-me-extended'
import { getKIDfromAccessToken, JWTScopeStrategy } from '../client'
import { AppUser } from '../client/user'
import { Payload } from './../../core/interfaces/Payload'
import { Strategy as CustomStrategy } from 'passport-custom'
import {
  consumeRememberMeToken,
  getClientById,
  getUserById,
  getUserByUsernameOrEmail,
  getUserRegistration,
  saveRememberMeToken,
} from './../controllers/utils'
import systemConfig from '../../config/system'

passport.use(
  new LocalStrategy(
    { usernameField: 'username', passReqToCallback: true },
    async (req, username, password, done) => {
      const clientId = String(req.query.client_id)
      getUserByUsernameOrEmail(username)
        .then(async (user) => {
          if (
            !user ||
            (user && user.accountStatusType === AccountStatusType.DISABLED)
          ) {
            return done(new Error('The user does not exists!'))
          }
          const registration = await getUserRegistration(user.id, clientId)
          if (!registration)
            return done(new Error("You don't have registration for this app!"))
          const passwordValid = await compare(password, user.password)
          if (!passwordValid) {
            return done(new Error('Invalid username or password!'))
          }
          return done(null, user)
        })
        .catch((error) => {
          console.log(error)
          done(new Error(error))
        })
    },
  ),
)

passport.use(
  new RememberMeStrategy(
    async (token, done) => {
      try {
        const user = await consumeRememberMeToken(token)
        if (!user) {
          return done(new Error('The user does not exists!'))
        }
        return done(null, user)
      } catch (err) {
        return done(new Error(err))
      }
    },
    async (user, done) => {
      const token = cryptoRandomString({ length: 64, type: 'url-safe' })
      try {
        const savedToken = await saveRememberMeToken(token, user.id)
        if (savedToken) return done(null, token)
      } catch (err) {
        return done(new Error(err))
      }
    },
  ),
)

passport.use(
  'jwt',
  new JWTScopeStrategy(async (req: any, done) => {
    const defaultApp: Application = req.session.defaultApp
    const host = req.protocol + '://' + req.get('host')
    const client = jwksClient({
      cache: true,
      rateLimit: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10000,
      jwksUri: `${host}/.well-known/jwks.json`,
    })
    let accessToken = req.cookies.access_token
    if (!accessToken && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ')
      if (parts.length === 2) {
        const scheme = parts[0]
        const credentials = parts[1]
        if (/^Bearer$/i.test(scheme)) {
          accessToken = credentials
        }
      }
    }
    if (!accessToken) return done(new Error('The token is empty!'))
    try {
      const kid = getKIDfromAccessToken(accessToken)
      const key = await client.getSigningKeyAsync(kid)
      const payload = jwt.verify(accessToken, key.getPublicKey(), {
        algorithms: ['RS256'],
        issuer: systemConfig.jwt_default_issuer,
      }) as Payload
      if (payload.token_use === 'access')
        req.session.client_id = payload.client_id
      const appUser = new AppUser(payload)
      if (appUser.canScope(req.scope))
        return done(new Error(`Not allowed scope`))
      const user = await getUserById(String(appUser.payload.sub))
      if (!user) return done(new Error('User not found!'))
      return done(null, user)
    } catch (err) {
      console.log('\t', err)
      if (err) done(new Error(err))
    }
  }),
)

passport.serializeUser((user: any, done: any) => {
  return done(null, user.id)
})

passport.deserializeUser((id: string, done) => {
  getUserById(id)
    .then((user) => {
      if (
        !user ||
        (user && user.accountStatusType === AccountStatusType.DISABLED)
      ) {
        return done(new Error('The user does not exists!'))
      }
      return done(null, user)
    })
    .catch((error) => done(new Error(error)))
})

function verifyClient(clientId: string, clientSecret: string, done: any) {
  getClientById(clientId, {
    EnabledScopes: true,
    RedirectUris: true,
    SelfRegistrationFields: true,
  })
    .then((client) => {
      if (!client)
        return done(null, false, {
          error: {
            status: 403,
            message: 'Unauthorized Client!',
          },
        })
      if (client.secret === clientSecret) return done(null, client)
      return done(null, client)
    })
    .catch((error) => done(new Error(error)))
}

passport.use(new BasicStrategy(verifyClient))

passport.use('clientPassword', new ClientPasswordStrategy(verifyClient))

passport.use('dynamicOAuth2Client', new CustomStrategy((req, done) => {}))

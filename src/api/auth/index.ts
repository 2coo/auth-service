'use strict'

import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { BasicStrategy } from 'passport-http'
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { prisma } from '../../context'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'
/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    console.log('#eey', email, password)
    prisma.user
      .findOne({
        where: {
          email,
        },
      })
      .then(async (user) => {
        if (!user) return done(null, false)
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) return done(null, false)
        return done(null, user)
      })
      .catch((error) => done(error))
  }),
)

passport.serializeUser((user: User, done) => done(null, user.email))

passport.deserializeUser((email: string, done) => {
  prisma.user
    .findOne({
      where: {
        email,
      },
    })
    .then((user) => {
      if (!user) return done(null, false)
      return done(null, user)
    })
    .catch((error) => done(error))
})

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate. Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header). While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
function verifyClient(clientId: string, clientSecret: string, done: any) {
  prisma.oAuthClient
    .findOne({
      where: {
        id: clientId,
      },
    })
    .then((client) => {
      if (!client) return done(null, false)
      if (client.secret === clientSecret) return done(null, false)
      return done(null, client)
    })
    .catch((error) => done(error))
}

passport.use(new BasicStrategy(verifyClient))

passport.use(new ClientPasswordStrategy(verifyClient))

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token). If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(
  new BearerStrategy((accessToken, done) => {
    prisma.oAuthAccessToken
      .findFirst({
        where: {
          accessToken,
        },
        include: {
          user: true,
          client: true,
          scopes: {
            include: {
              scope: true,
            },
          },
        },
      })
      .then((localAccessToken) => {
        if (!localAccessToken) return done(null, false)
        if (localAccessToken.user) {
          done(null, localAccessToken.user, {
            scope: localAccessToken.scopes
              .map((scope) => scope.scope.name)
              .join(' '),
          })
        } else {
          prisma.oAuthClient
            .findOne({
              where: {
                id: localAccessToken.client.id,
              },
            })
            .then((client) => {
              if (!client) return done(null, false)
            })
        }
      })
      .catch((error) => done(error))
  }),
)

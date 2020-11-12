import {
  oAuthCustomScope,
  oAuthResourceServer,
  oAuthScope,
} from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import moment from 'moment-timezone'
import oauth2orize from 'oauth2orize'
import passport from 'passport'
import { prisma } from '../../context'
import { ensureLoginWithPoolIdentifier } from '../utils'
import { compare } from 'bcryptjs'
import { validateAuthCodeExpiration } from '../validate'
// Create OAuth 2.0 server
const server = oauth2orize.createServer()

// Register serialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated. To complete the transaction, the
// user must authenticate and approve the authorization request. Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session. Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient((client, done) => done(null, client.id))

server.deserializeClient((id, done) => {
  prisma.oAuthClient
    .findOne({
      where: {
        id,
      },
      include: {
        EnabledScopes: true,
        EnabledCustomScopes: true,
        UserPool: true,
      },
    })
    .then((client) => {
      return done(null, client)
    })
    .catch((error) => {
      return done(error)
    })
})

function issueTokens(userId: string | null, clientId: string, done: any) {
  prisma.oAuthClient
    .findOne({
      where: {
        id: clientId,
      },
    })
    .then((client) => {
      if (!client) throw new Error('The client not found!')
      if (userId) {
        prisma.user
          .findOne({
            where: {
              id: userId,
            },
          })
          .then((user) => {
            if (!user) throw new Error('The user not found!')
            prisma.oAuthAccessToken
              .create({
                data: {
                  Client: {
                    connect: {
                      id: client.id,
                    },
                  },
                  User: {
                    connect: {
                      id: user.id,
                    },
                  },
                  expirationDate: moment()
                    .add({
                      minute: client.accessTokenLifetime,
                    })
                    .toISOString(),
                },
              })
              .then((accessToken) => {
                prisma.oAuthRefreshToken
                  .create({
                    data: {
                      Client: {
                        connect: {
                          id: client!.id,
                        },
                      },
                      User: {
                        connect: {
                          id: user!.id,
                        },
                      },
                      expirationDate: moment()
                        .add({
                          minute: client!.refreshTokenLifetime,
                        })
                        .toISOString(),
                    },
                  })
                  .then((refreshToken) => {
                    return done(
                      null,
                      accessToken.accessToken,
                      refreshToken.refreshToken,
                      {
                        expires_in: client.accessTokenLifetime * 60,
                      },
                    )
                  })
              })
          })
      } else {
        prisma.oAuthAccessToken
          .create({
            data: {
              Client: {
                connect: {
                  id: client.id,
                },
              },
              expirationDate: moment()
                .add({
                  minute: client.accessTokenLifetime,
                })
                .toISOString(),
            },
          })
          .then((accessToken) => {
            prisma.oAuthRefreshToken
              .create({
                data: {
                  Client: {
                    connect: {
                      id: client!.id,
                    },
                  },
                  expirationDate: moment()
                    .add({
                      minute: client!.refreshTokenLifetime,
                    })
                    .toISOString(),
                },
              })
              .then((refreshToken) => {
                return done(
                  null,
                  accessToken.accessToken,
                  refreshToken.refreshToken,
                )
              })
          })
      }
    })
    .catch((error) => {
      return done(new Error(error))
    })
}

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources. It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes. The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(
  oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
    prisma.oAuthAuthorizationCode
      .create({
        data: {
          Client: {
            connect: {
              id: client.id,
            },
          },
          expirationDate: moment()
            .add({
              minute: client.accessTokenLifetime,
            })
            .toISOString(),
          redirectURI: redirectUri,
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      })
      .then((authCode) => {
        return done(null, authCode.code)
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

// Grant implicit authorization. The callback takes the `client` requesting
// authorization, the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a token, which is bound to these
// values.

server.grant(
  oauth2orize.grant.token((client, user, ares, done) => {
    issueTokens(user.id, client.id, done)
  }),
)

// Exchange authorization codes for access tokens. The callback accepts the
// `client`, which is exchanging `code` and any `redirectUri` from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code. The issued access token response can include a refresh token and
// custom parameters by adding these to the `done()` call

server.exchange(
  oauth2orize.exchange.code((client, code, redirectUri, done) => {
    prisma.oAuthAuthorizationCode
      .findOne({
        where: {
          code: code,
        },
      })
      .then(async (authCode) => {
        console.log('#hey', authCode)

        if (!authCode) return done(null, false)
        await prisma.oAuthAuthorizationCode.delete({
          where: {
            id: authCode.id,
          },
        })
        if (redirectUri !== authCode.redirectURI) return done(null, false)
        const _authCode = validateAuthCodeExpiration(
          code,
          client.UserPool.identifier,
        )
        issueTokens(authCode.userId, client.id, done)
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

// Exchange user id and password for access tokens. The callback accepts the
// `client`, which is exchanging the user's name and password from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the code.

server.exchange(
  oauth2orize.exchange.password((client, username, password, scope, done) => {
    // Validate the client
    prisma.oAuthClient
      .findOne({
        where: {
          id: client.id,
        },
      })
      .then((localClient) => {
        if (!localClient) return done(null, false)
        if (localClient.secret !== client.secret) return done(null, false)
        // validate the user
        prisma.user
          .findOne({
            where: {
              username_userPoolId: {
                username,
                userPoolId: client.UserPool.id,
              },
            },
          })
          .then(async (user) => {
            if (!user) return done(null, false)
            const passwordValid = await compare(password, user.password)
            if (!passwordValid) return done(null, false)
            // Everything validated, return the token
            issueTokens(user.id, client.id, done)
          })
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

// Exchange the client id and password/secret for an access token. The callback accepts the
// `client`, which is exchanging the client's id and password/secret from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the client who authorized the code.

server.exchange(
  oauth2orize.exchange.clientCredentials((client, scope, done) => {
    // Validate the client
    prisma.oAuthClient
      .findOne({
        where: {
          id: client.id,
        },
      })
      .then((localClient) => {
        if (!localClient) return done(null, false)
        if (localClient.secret !== client.secret) return done(null, false)
        // Everything validated, return the token
        // Pass in a null for user id since there is no user with this grant type
        issueTokens(null, client.clientId, done)
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

// User authorization endpoint.
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request. In
// doing so, is recommended that the `redirectUri` be checked against a
// registered value, although security requirements may vary across
// implementations. Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectUri` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction. It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization). We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view.

export const authorization = [
  ensureLoginWithPoolIdentifier(),
  server.authorization(
    (clientId, redirectUri, done) => {
      prisma.oAuthClient
        .findOne({
          where: {
            id: clientId,
          },
          include: {
            RedirectUris: true,
            EnabledScopes: true,
            EnabledCustomScopes: true,
            UserPool: true,
          },
        })
        .then((client) => {
          if (!client) return done(null, false)
          if (
            client.RedirectUris.some(
              (localRedirectUri) => localRedirectUri.url === redirectUri,
            )
          ) {
            return done(null, client, redirectUri)
          }
          return done(
            new Error(
              'Redirect uri does not match the registered Redirect Uri for this app.',
            ),
          )
        })
        .catch((error) => {
          return done(error)
        })
    },
    (client, user, done: any) => {
      // Check if grant request qualifies for immediate approval
      // Auto-approve
      // if (client.isTrusted) return done(null, true)
      if (client != null && client.trus && client.isTrusted === true)
        return done(null, true)
      prisma.oAuthAccessToken
        .findFirst({
          where: {
            oAuthClientId: client.id,
            userId: user.id,
          },
        })
        .then((accessToken) => {
          // Auto-approve
          if (accessToken) return done(null, true)

          // Otherwise ask user
          return done(null, false)
        })
        .catch((error) => done(error))
      return done(null, false)
    },
  ),
  async (request: Request, response: Response, next: NextFunction) => {
    const allClientScopes = [
      ...request!.oauth2!.client.EnabledScopes.map(
        (scope: oAuthScope) => scope.name,
      ),
      ...request!.oauth2!.client.EnabledCustomScopes.map(
        (scope: oAuthCustomScope) => scope.name,
      ),
    ]
    const errorScopes = (request.query!.scope as string)
      .split(' ')
      .map((scope: string) =>
        allClientScopes.indexOf(scope) > -1 ? false : scope,
      )
      .filter((scope: Boolean | string) => scope)

    if (errorScopes.some((scope: Boolean | string) => scope)) {
      return response.json({
        message: `Invalid scopes: [${errorScopes.join(', ')}]`,
      })
    }
    const user: any = request.user

    const userScopes = _.flatMap(user!.Roles, ({ Scopes, CustomScopes }) => {
      return _.concat(
        Scopes.map((scope: oAuthScope) => scope.name),
        CustomScopes.map(
          (customScope: {
            name: string
            ResourceServer: oAuthResourceServer
          }) => `${customScope.ResourceServer!.identifier}/${customScope.name}`,
        ),
      )
    })

    const userGroupScopes = _.flatMap(user.Groups, (group: any) =>
      _.flatMap(group.Roles, ({ Scopes, CustomScopes }) => {
        return _.concat(
          Scopes.map((scope: oAuthScope) => scope.name),
          CustomScopes.map(
            (customScope: {
              name: string
              ResourceServer: oAuthResourceServer
            }) =>
              `${customScope.ResourceServer!.identifier}/${customScope.name}`,
          ),
        )
      }),
    )

    const allScopesOfUser = _.uniq(_.concat(userScopes, userGroupScopes))

    if (
      !(request.query.scope as string)
        .split(' ')
        .every((scope) => allScopesOfUser.indexOf(scope) > -1)
    ) {
      return response.json({
        message: `Permission denied: There are some scopes that are not granted for you!`,
      })
    }
    response.render('dialog', {
      transactionId: request!.oauth2!.transactionID,
      user: request.user,
      client: request!.oauth2!.client,
    })
  },
]

// User decision endpoint.
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application. Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

export const decision = [ensureLoginWithPoolIdentifier(), server.decision()]

// Token endpoint.
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.

export const token = [
  passport.authenticate(['basic', 'clientPassword'], {
    session: false,
    passReqToCallback: true,
  }),
  server.token({
    passReqToCallback: true,
  }),
  server.errorHandler(),
]

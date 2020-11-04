import { compare } from 'bcryptjs'
import login from 'connect-ensure-login'
import moment from 'moment-timezone'
import oauth2orize from 'oauth2orize'
import passport from 'passport'
import { prisma } from '../../context'

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
                    return done(null, accessToken, refreshToken, {
                      username: user.username,
                      email: user.email,
                    })
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
                return done(null, accessToken, refreshToken)
              })
          })
      }
    })
    .catch((error) => {
      return done(error)
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
              id: user.email,
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
          code_oAuthClientId: {
            code: code,
            oAuthClientId: client.id,
          },
        },
      })
      .then((authCode) => {
        if (!authCode) return done(null, false)
        if (redirectUri !== authCode.redirectURI) return done(null, false)
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
    // db.clients.findByClientId(client.clientId, (error, localClient) => {
    //   return done(error);
    //   if (!localClient) return done(null, false);
    //   if (localClient.clientSecret !== client.clientSecret) return done(null, false);
    //   // Validate the user
    //   db.users.findByUsername(username, (error, user) => {
    //     return done(error);
    //     if (!user) return done(null, false);
    //     if (password !== user.password) return done(null, false);
    //     // Everything validated, return the token
    //     issueTokens(user.id, client.clientId, done);
    //   });
    // });
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
              username,
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
  login.ensureLoggedIn('/login'),
  server.authorization(
    (clientId, redirectUri, done) => {
      prisma.oAuthClient
        .findOne({
          where: {
            id: clientId,
          },
          include: {
            RedirectUris: true,
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
          return done(null, false)
        })
        .catch((error) => {
          return done(error)
        })
    },
    (client, user, done: any) => {
      // Check if grant request qualifies for immediate approval

      // Auto-approve
      if (client.isTrusted) return done(null, true)
      prisma.oAuthAccessToken
        .findOne({
          where: {
            userId_oAuthClientId: {
              userId: user.id,
              oAuthClientId: client.id,
            },
          },
        })
        .then((accessToken) => {
          // Auto-approve
          if (accessToken) return done(null, true)

          // Otherwise ask user
          return done(null, false)
        })
        .catch((error) => done(error))
    },
  ),
  async (request: any, response: any) => {
    // prisma.oAuthScope.findMany({
    //   where: {
    //     name: {
    //       in: request.query.scope.split(' '),
    //     },
    //   },
    // }).then((scopes) => {
    //   console.log(scopes)
    // })
    const scopes = await prisma.oAuthClient
      .findOne({
        where: {
          id: request.query.client_id,
        },
      })
      .EnabledScopes({
        where: {
          name: {
            in: request.query.scope.split(' '),
          },
        },
      })
    console.log(scopes)
    response.render('dialog', {
      transactionId: request.oauth2.transactionID,
      user: request.user,
      client: request.oauth2.client,
    })
  },
]

// User decision endpoint.
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application. Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

export const decision = [login.ensureLoggedIn('/login'), server.decision()]

// Token endpoint.
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.

export const token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {
    session: false,
  }),
  server.token(),
  server.errorHandler(),
]

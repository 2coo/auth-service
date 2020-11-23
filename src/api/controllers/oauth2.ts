import { compare } from 'bcryptjs'
import { ensureLoggedIn } from 'connect-ensure-login'
import { Request, Response } from 'express'
import _ from 'lodash'
import moment from 'moment-timezone'
import oauth2orize from 'oauth2orize'
import passport from 'passport'
import { store } from '../../redisclient'
import {
  deleteAuthCode,
  generateAuthCode,
  getAuthCode,
  getClient,
  getClientById,
  getScopesFromClient,
  getScopesFromUser,
  getUserByUsernameOrEmail,
  issueAccessToken,
  issueRefreshToken
} from './utils'

// Create OAuth 2.0 server
const server = oauth2orize.createServer({
  store,
  loadTransaction: true,
})

server.serializeClient((client, done) => done(null, client.id))

server.deserializeClient((id, done) => {
  getClientById(id)
    .then((client) => {
      return done(null, client)
    })
    .catch((error) => {
      return done(error)
    })
})

const issueTokens = (
  userId: string | null,
  clientId: string,
  scope: Array<string>,
  done: any,
) => {
  return getClient(clientId)
    .then((client) => {
      if (!client) throw new Error('The client not found!')
      issueAccessToken(
        clientId,
        userId,
        scope,
        client.accessTokenLifetime,
      ).then(async (accessToken) => {
        let refreshToken = null
        if (userId) {
          refreshToken = (
            await issueRefreshToken(
              clientId,
              userId,
              scope,
              client.refreshTokenLifetime,
            )
          ).refreshToken
        }
        return done(null, accessToken, refreshToken, {
          expires_in: client.accessTokenLifetime * 60,
        })
      })
    })
    .catch((error) => {
      return done(new Error(error))
    })
}

server.grant(
  oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
    generateAuthCode(client.id, user.id, redirectUri, ares.scope)
      .then((authCode) => {
        return done(null, authCode.code)
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

server.grant(
  oauth2orize.grant.token((client, user, ares, done) => {
    issueTokens(user.id, client.id, ares.scope, done)
  }),
)

server.exchange(
  oauth2orize.exchange.code((client, code, redirectUri, done) => {
    console.log('#code', code)
    getAuthCode(code)
      .then(async (authCode) => {
        if (!authCode) return done(null, false)
        if (redirectUri !== authCode.redirectURI) return done(null, false)
        console.log('code existing!')

        if (!moment().isBefore(moment.parseZone(authCode.expirationDate)))
          return done(null, false)
        console.log('code is available')

        await deleteAuthCode(authCode.id)
        console.log('code is deleted')
        const scopes = authCode.Scopes.map((scope) => scope.name)
        issueTokens(authCode.userId, client.id, scopes, done)
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

server.exchange(
  oauth2orize.exchange.password((client, username, password, scope, done) => {
    // Validate the client
    getClientById(client.id)
      .then((localClient) => {
        if (!localClient) return done(null, false)
        if (localClient.secret !== client.secret) return done(null, false)
        // validate the user
        getUserByUsernameOrEmail(username).then(async (user) => {
          if (!user) return done(null, false)
          const passwordValid = await compare(password, user.password)
          if (!passwordValid) return done(null, false)
          // Everything validated, return the token
          issueTokens(user.id, client.id, scope, done)
        })
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

server.exchange(
  oauth2orize.exchange.clientCredentials((client, scope, done) => {
    // Validate the client
    getClientById(client.id)
      .then((localClient) => {
        if (!localClient) return done(null, false)
        if (localClient.secret !== client.secret) return done(null, false)
        // Everything validated, return the token
        // Pass in a null for user id since there is no user with this grant type
        issueTokens(null, client.clientId, scope, done)
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

// User authorization endpoint.

export const authorization = [
  ensureLoggedIn(),
  server.authorization(
    (clientId, redirectUri, done) => {
      getClientById(clientId)
        .then((client) => {
          if (!client) return done(null, false)
          if (
            _.some(client.RedirectUris, {
              uri: redirectUri,
            })
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
      if (
        client != null &&
        client.trustedClient &&
        client.trustedClient === true
      )
        return done(null, true)
      return done(null, false)
    },
  ),
  async (request: Request, response: Response) => {
    const clientScopes = getScopesFromClient(request!.oauth2!.client)
    const invalidScopes = _.difference(
      (request.query!.scope as string).split(' '),
      clientScopes,
    )
    if (invalidScopes.length > 0) {
      return response.status(500).json({
        message: `Invalid scopes: [${invalidScopes.join(', ')}]`,
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

export const decision = [
  ensureLoggedIn(),
  server.decision((req: any, done) => {
    // remove all scopes user does not have
    const requestedScopes = Array<string>(req.oauth2?.req.scope)

    const user: any = req.user

    const userScopes = getScopesFromUser(user)

    const client = req.oauth2.client

    const clientScopes = getScopesFromClient(client)

    return done(null, {
      scope: _.filter(
        requestedScopes,
        (scope) =>
          userScopes.indexOf(scope) > -1 && clientScopes.indexOf(scope) > -1,
      ),
    })
  }),
]

export const token = [
  passport.authenticate(['basic', 'clientPassword'], {
    session: false,
    passReqToCallback: true,
  }),
  server.token({
    session: false,
    passReqToCallback: true,
  }),
  server.errorHandler(),
]

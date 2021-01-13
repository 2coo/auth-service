import { Application, Scope } from '@prisma/client'
import { compare } from 'bcryptjs'
import { ensureLoggedIn } from 'connect-ensure-login'
import { NextFunction, Response } from 'express'
import * as _ from 'lodash'
import * as moment from 'moment-timezone'
import * as oauth2orize from 'oauth2orize'
import * as passport from 'passport'
import * as queryString from 'query-string'
import { store } from '../../redisclient'
import { defaultLinkBuilder, renderSPA } from '../client'
import {
  deleteAuthCode,
  generateAuthCode,
  getAuthCode,
  getClient,
  getClientById,
  getRefreshToken,
  getScopesFromClient,
  getUserByUsernameOrEmail,
  getUserRegistration,
  isExpired,
  issueAccessToken,
  issueIdToken,
  issueRefreshToken,
} from './utils'
import * as createError from 'http-errors'

// Create OAuth 2.0 server
const server = oauth2orize.createServer({
  store,
  loadTransaction: true,
})

server.serializeClient((client, done) => done(null, client.id))

server.deserializeClient((id, done) => {
  getClientById(id, {
    EnabledScopes: true,
    RedirectUris: true,
    SelfRegistrationFields: true,
  })
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
  onlyAccessToken: boolean = false,
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
        if (userId && !onlyAccessToken) {
          refreshToken = (
            await issueRefreshToken(
              clientId,
              userId,
              scope,
              client.refreshTokenLifetime,
            )
          ).refreshToken
        }
        let idToken = null
        if (scope.indexOf('openid') > -1 && userId) {
          idToken = await issueIdToken(
            clientId,
            userId,
            scope,
            client.idTokenLifetime,
          )
        }
        return done(null, accessToken, refreshToken, {
          expiresIn: client.accessTokenLifetime * 60,
          ...(idToken && {
            id_token: idToken,
          }),
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
    getAuthCode(code)
      .then(async (authCode) => {
        if (!authCode) return done(null, false)
        if (redirectUri !== authCode.redirectURI) return done(null, false)
        if (!moment().isBefore(moment.parseZone(authCode.expirationDate)))
          return done(null, false)
        await deleteAuthCode(authCode.id)
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
        issueTokens(null, client.clientId, scope, done, true)
      })
      .catch((error) => {
        return done(error)
      })
  }),
)

server.exchange(
  oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
    getRefreshToken(refreshToken)
      .then((refreshToken) => {
        if (!refreshToken) return done(null, false)
        if (isExpired(refreshToken.expirationDate)) return done(null, false)
        issueTokens(
          refreshToken.userId,
          client.id,
          refreshToken.Scopes.map((scope) => scope.name),
          done,
          true,
        )
      })
      .catch((err) => done(null, false))
  }),
)

export const trustedAppHandler = server.authorization(
  (clientId, redirectUri, done) => {
    getClientById(clientId, {
      EnabledScopes: true,
      RedirectUris: true,
      SelfRegistrationFields: true,
    })
      .then((client: any) => {
        if (!client) return done(null, false)
        if (
          _.some(client!.RedirectUris, {
            url: redirectUri,
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
  (client: Application & { EnabledScopes: Array<Scope> }, user, done: any) => {
    // Check if grant request qualifies for immediate approval
    // Auto-approve
    if (
      client != null &&
      client.trustedApplication &&
      client.trustedApplication === true
    ) {
      return done(null, true, {
        scope: client.EnabledScopes.map((scope) => scope.name),
      })
    }
    return done(null, false)
  },
)

// User authorization endpoint.
export const authorization = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  if (!req.isAuthenticated()) {
    return renderSPA(req, res, next)
  }
  let application: any = await getClientById(req.session.defaultApp.id, {
    EnabledScopes: true,
  })
  if (req.query.client_id) {
    application = await getClientById(req.query.client_id, {
      EnabledScopes: true,
    })
  }
  req.query = {
    ...queryString.parse(defaultLinkBuilder(application, '')),
    ...req.query,
  }
  const queries = queryString.stringify(req.query)
  if (!application)
    return res.status(403).json({
      success: false,
      message: 'The application does not exists!',
    })
  if (application?.trustedApplication) {
    return trustedAppHandler(req, res, next)
  }
  const registration = await getUserRegistration(
    req.user.id,
    req.query.client_id,
  )
  if (!registration)
    return next(new Error("You don't have registration for this app!"))

  return res.redirect(`/oauth2/authorize/dialog?${queries}`)
}

export const dialog = [
  server.authorization(
    (clientId, redirectUri, done) => {
      getClientById(clientId, {
        EnabledScopes: true,
        RedirectUris: true,
        SelfRegistrationFields: true,
      })
        .then((client: any) => {
          if (!client) return done(null, false)
          if (
            _.some(client.RedirectUris, {
              url: redirectUri,
            })
          ) {
            return done(null, client, redirectUri)
          }
          return done(
            createError(
              403,
              'Redirect uri does not match the registered Redirect Uri for this app.',
            ),
          )
        })
        .catch((error) => {
          return done(error)
        })
    },
    (
      client: Application & { EnabledScopes: Array<Scope> },
      user,
      done: any,
    ) => {
      // Check if grant request qualifies for immediate approval
      // Auto-approve
      if (
        client != null &&
        client.trustedApplication &&
        client.trustedApplication === true
      ) {
        return done(null, true)
      }
      return done(null, false)
    },
  ),
  async (request: any, response: Response) => {
    const client: Application & { EnabledScopes: Array<Scope> } = request!
      .oauth2!.client
    const clientScopes = getScopesFromClient(client)
    const scopes = request.query!.scope
      ? (request.query!.scope as string).split(' ')
      : []

    const invalidScopes = _.difference(scopes, clientScopes)
    if (invalidScopes.length > 0) {
      return response.status(500).json({
        message: `Invalid scopes: [${invalidScopes.join(', ')}]`,
      })
    }
    response.json({
      transaction_id: request!.oauth2!.transactionID,
      email: request.user.email,
      application: request!.oauth2!.client.name,
      scopes: request!
        .oauth2!.client.EnabledScopes.filter(
          (scope: Scope) => scopes.indexOf(scope.name) > -1,
        )
        .map((scope: Scope) => ({
          name: scope.name,
          description: scope.description,
        })),
    })
  },
]

// User decision endpoint.

export const decision = [
  ensureLoggedIn(),
  (req: any, res: Response, next: NextFunction) => {
    console.log(req.body)
    next()
  },
  server.decision((req: any, done) => {
    // remove all client does not have
    const requestedScopes = req.oauth2?.req.scope as Array<string>
    const client = req.oauth2.client
    const clientScopes = getScopesFromClient(client)
    return done(null, {
      scope: _.filter(
        requestedScopes,
        (scope: any) => clientScopes.indexOf(scope) > -1,
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

export const idpresponse = (req: any, res: Response, next: NextFunction) => {
  //todo
}

export const providers = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const queryParams = req.query
  if (!queryParams.client_id) {
    queryParams.client_id = req.session.defaultApp.id
  }
  const application = getClientById(queryParams.client_id)
  const providers = (
    await application.IdentityProviders({
      include: {
        IdentityProvider: true,
      },
    })
  )?.map((provider) => provider.providerType)
  return res.json({
    success: true,
    data: providers ?? [],
  })
}

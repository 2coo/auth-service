import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
import Express from 'express'
import expressSession from 'express-session'
import passport from 'passport'
import path from 'path'
import redis from 'redis'
import serveStatic from 'serve-static'
import vhost from 'vhost-ts'
import {
  grantTypeCodeHandler,
  grantTypeRefreshHandler,
  renderSPA,
  verifyAppOrRedirect,
  verifySSO,
} from './client'
import { loggerMiddleware, tenantAndDefaultAppMiddleware } from './client/index'
import routes from './controllers'

const corsOptions = {
  origin: ['http://localhost:3000'], //resource server
  credentials: true,
  allowedHeaders: 'X-Requested-With,content-type',
  exposedHeaders: ['set-cookie'],
}

const RedisStore = connectRedis(expressSession)

const DOMAIN = process.env.DOMAIN

const redisClient = redis.createClient(
  Number(process.env.REDIS_PORT),
  process.env.REDIS_HOST,
  {
    no_ready_check: true,
  },
)

module.exports = function (app: Express.Application) {
  app.use(Express.json())
  app.use(
    Express.urlencoded({
      extended: false,
    }),
  )
  app.use(errorHandler())
  app.use(cookieParser(process.env.SESSION_SECRET || "s4per$ecret"))
  app.use(
    expressSession({
      name: 'TOMUJIN_DIGITAL_AUTH',
      saveUninitialized: true,
      resave: true,
      secret: process.env.SESSION_SECRET as string,
      store: new RedisStore({ client: redisClient }),
      cookie: {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict', if you don't want SSO, it should be uncommented!
        httpOnly: true,
        maxAge: Number(process.env.SESSION_MAX_AGE),
      },
    }),
  )
  // Use the passport package in our application
  app.use(passport.initialize())
  app.use(passport.session())

  // Custom Middlewares and Routes
  app.use(
    serveStatic(path.join(__dirname, '../../build'), {
      index: false,
    }),
  )
  app.use((req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
      return res.status(204).end()
    }
    next()
  })

  app.use(loggerMiddleware)

  // Passport configuration
  require('./auth')

  // Routes
  const router = Express.Router()

  router.use(passport.authenticate('remember-me'))
  // tenant check
  router.use(tenantAndDefaultAppMiddleware)

  // Create endpoint handlers for oauth2 authorize
  router
    .route('/oauth2/authorize')
    .get([
      grantTypeCodeHandler(),
      grantTypeRefreshHandler(),
      verifyAppOrRedirect,
      routes.oauth2.authorization,
    ])
    .post(routes.site.login)
  router.post('/oauth2/register', verifyAppOrRedirect, routes.user.register)
  router.post('/oauth2/register/get/fields', routes.user.fields)
  router.get('/oauth2/userinfo', routes.user.userinfo)
  router
    .route('/oauth2/authorize/dialog')
    .get([verifySSO(), renderSPA])
    .post(routes.oauth2.dialog)

  router.get('/oauth2/authorize/decision', routes.oauth2.decision)
  // Create endpoint handlers for oauth2 token
  router.route('/oauth2/token').post(routes.oauth2.token)
  router.route('/.well-known/jwks.json').get(routes.token.jwks)
  router.post('/oauth2/token/revoke', routes.token.revoke)

  // Create enpoints for AuthSystem (SPA)
  router.get('/', renderSPA)
  router
    .route('/login')
    .get(verifySSO(), (req, res, next) => res.redirect('/app'))
  router.get('/logout', [routes.site.logout, renderSPA])
  router.get(/^\/app(\/.*)?/, [verifySSO(), renderSPA])
  //subdomain tenant
  app.use(vhost(`*.${DOMAIN}`, router))
  app.use(vhost(`${DOMAIN}`, router))
}

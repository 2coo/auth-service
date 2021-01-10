import connectRedis from 'connect-redis'
import errorHandler from 'errorhandler'
import Express, { Request, Response, NextFunction } from 'express'
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
  verifyEmailIsVerified,
  verifySSO,
} from './client'
import { loggerMiddleware, tenantAndDefaultAppMiddleware } from './client/index'
import routes from './controllers'
import redisConfig from '../config/redis'
import systemConfig from '../config/system'
// const corsOptions = {
//   origin: ['http://localhost:3000'], //resource server
//   credentials: true,
//   allowedHeaders: 'X-Requested-With,content-type',
//   exposedHeaders: ['set-cookie'],
// }

const RedisStore = connectRedis(expressSession)

const DOMAIN = systemConfig.domain

const redisClient = redis.createClient(
  Number(redisConfig.port),
  redisConfig.host,
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
  app.use(
    expressSession({
      name: 'TOMUJIN_DIGITAL_AUTH',
      saveUninitialized: true,
      resave: true,
      secret: systemConfig.session_secret,
      store: new RedisStore({ client: redisClient }),
      cookie: {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict', if you don't want SSO, it should be uncommented!
        httpOnly: true,
        maxAge: systemConfig.session_max_age,
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

  router.post('/oauth2/register', routes.user.register)
  router.post('/oauth2/register/get/fields', routes.user.fields)
  router.get('/signup/validate-email', [verifySSO(), renderSPA])
  router.get('/signup/validate-email/info', [
    verifySSO(),
    routes.site.validate_email,
  ])
  router.post('/signup/validate-email/code', [verifySSO(), routes.site.verify_code])
  router.get('/oauth2/userinfo', routes.user.userinfo)
  router.get('/myabioauth2/registerlities', routes.user.abilities)
  router
    .route('/oauth2/authorize/dialog')
    .get([verifySSO(), verifyEmailIsVerified(), renderSPA])
    .post(routes.oauth2.dialog)

  // error handler
  router.use(function (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.log(err)

    // render the error page
    if (err.status !== undefined) {
      res.status(err.status)
      return res.json({
        success: false,
        message: err.message,
        error_description: err.description,
      })
    }
    next(err)
  })
  router.get('/locales/:locale/translation.json', (req, res, next) => {
    res.json({
      hi: 'tue',
    })
  })
  router
    .route('/oauth2/authorize/decision')
    .post(routes.oauth2.decision)
    .get(routes.oauth2.decision)
  // Create endpoint handlers for oauth2 token
  router.route('/oauth2/token').post(routes.oauth2.token)
  router.route('/.well-known/jwks.json').get(routes.token.jwks)
  router.post('/oauth2/token/revoke', routes.token.revoke)
  router.get('/oauth2/providers', routes.oauth2.providers)
  router.get('/oauth2/idpresponse', routes.oauth2.idpresponse)

  // Create enpoints for AuthSystem (SPA)
  router.get('/', renderSPA)
  router
    .route('/login')
    .get(routes.oauth2.authorization)
    .post((req: any, res: Response, next: NextFunction) => {
      req.query.client_id = req.session.defaultApp.id
      next()
    }, routes.site.login)
  router.get('/logout', [routes.site.logout, renderSPA])
  router.get(/^\/app(\/.*)?/, [verifySSO(), verifyEmailIsVerified(), renderSPA])
  router.get('*', renderSPA)
  //subdomain tenant
  app.use(vhost(`*.${DOMAIN}`, router))
  app.use(vhost(`${DOMAIN}`, router))
}

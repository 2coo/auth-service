import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
import Express, { NextFunction, Response } from 'express'
import expressSession from 'express-session'
import passport from 'passport'
import path from 'path'
import redis from 'redis'
import vhost from 'vhost-ts'
import { prisma } from '../context'
import {
  authCodeCallback,
  ensureLoggedInWithCookie,
  removeCookieIfSSOisLoggedOut,
  renderSPA,
} from './client'
import routes from './controllers'
import { getDefaultApplicationByTenant } from './controllers/utils'
import serveStatic from 'serve-static'
import { ensureLoggedIn } from 'connect-ensure-login'
import { remove } from 'lodash'

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
  app.use(
    serveStatic(path.join(__dirname, '../../build'), {
      index: false,
    }),
  )
  app.use(Express.json())
  app.use(
    Express.urlencoded({
      extended: false,
    }),
  )
  app.use(errorHandler())
  app.use(cookieParser())
  app.use(
    expressSession({
      name: 'AUTHORIZATION_SERVER',
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
  app.use((req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
      return res.status(204).end()
    }
    next()
  })

  app.use((req, res, next) => {
    console.log(
      '#ON:',
      `[${req.method}]\t`,
      req.url + '\t',
      req.url === '/oauth2/token' ? `(GRANT_TYPE: ${req.body.grant_type})` : '',
    )
    next()
  })

  // Passport configuration
  require('./auth')

  const router = Express.Router()

  router.use(passport.authenticate('remember-me'))
  // tenant check
  router.use(async (req: any, res, next) => {
    const tenantDomain = req.vhost[0] === undefined ? '*' : req.vhost[0]
    const tenant = await prisma.tenant.findOne({
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
  })

  router.get('/logout', routes.site.logout, renderSPA)
  // home
  router.get('/', [ensureLoggedInWithCookie(), renderSPA])

  // static resources for stylesheets, images, javascript files
  router.route('/login').get(ensureLoggedInWithCookie()).post(routes.site.login)

  // Create endpoint handlers for oauth2 authorize
  router.get('/oauth2/authorize', authCodeCallback, routes.oauth2.authorization)

  router.post('/oauth2/register/get/fields', routes.user.fields)

  router.post('/oauth2/register', routes.user.register)

  router.get('/oauth2/userinfo', routes.user.userinfo)

  router
    .route('/oauth2/authorize/dialog')
    .get([ensureLoggedIn(), renderSPA])
    .post(routes.oauth2.dialog)

  router.get('/oauth2/authorize/decision', routes.oauth2.decision)
  // Create endpoint handlers for oauth2 token
  router.route('/oauth2/token').post(routes.oauth2.token)

  router.route('/.well-known/jwks.json').get(routes.token.jwks)

  router.post('/oauth2/token/revoke', routes.token.revoke)

  router.get(/^\/app(\/.*)?/, removeCookieIfSSOisLoggedOut, renderSPA)

  router.get('*', renderSPA)
  //subdomain tenant
  app.use(vhost(`*.${DOMAIN}`, router))
  app.use(vhost(`${DOMAIN}`, router))
}

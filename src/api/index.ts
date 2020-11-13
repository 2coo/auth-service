import Express from 'express'
import session from 'express-session'
import _ from 'lodash'
import passport from 'passport'
import routes from './controllers'
import cookieParser from 'cookie-parser'
import errorHandler from 'errorhandler'
import path from 'path'
import { prisma } from '../context'
import { ensureLoginWithPoolIdentifier } from './utils'

module.exports = function (app: Express.Application) {
  const MemoryStore = session.MemoryStore

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, './views'))
  app.use(Express.json())
  app.use(
    Express.urlencoded({
      extended: true,
    }),
  )
  app.use(errorHandler())
  app.use(cookieParser())
  app.use(
    session({
      name: 'AUTHORIZATION_SERVER',
      saveUninitialized: true,
      resave: true,
      secret: process.env.SESSION_SECRET as string,
      store: new MemoryStore(),
      // key: 'authorization.sid',
      cookie: { maxAge: Number(process.env.SESSION_MAX_AGE) },
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

  app.use(Express.static(path.join(__dirname, './public')))

  app.use((req, res, next) => {
    console.log("# Request recieved on: ", req.url)
    next()
  })

  // Passport configuration
  require('./auth')

  const checkUserPoolExists = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) => {
    const userPool = await prisma.userPool.findOne({
      where: {
        identifier: req.params.userPoolIdentifier,
      },
    })
    if (!userPool) {
      res.send('UserPool not found!')
    }
    next()
  }

  const router = Express.Router({ mergeParams: true })
  // site

  router.get('/', [ensureLoginWithPoolIdentifier(), routes.site.index])
  // static resources for stylesheets, images, javascript files
  router.route('/login').get(routes.site.loginForm).post(routes.site.login)
  router.get('/logout', routes.site.logout)
  router.get('/account', routes.site.account)

  // Create endpoint handlers for oauth2 authorize
  router
    .route('/oauth2/authorize')
    .get(routes.oauth2.authorization)
    .post(routes.oauth2.decision)
  // Create endpoint handlers for oauth2 token
  router.route('/oauth2/token').post(routes.oauth2.token)
  router.get('/api/profile', routes.user.info)
  router.get('/api/clientinfo', routes.client.info)

  router.get('/api/revoke', routes.token.revoke)
  router.get('/api/tokeninfo/:access_token', routes.token.info)
  app.use('/:userPoolIdentifier', checkUserPoolExists, router)
}

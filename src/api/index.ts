import * as Express from 'express'
import * as session from 'express-session'
import * as _ from 'lodash'
import * as passport from 'passport'
import * as routes from './controllers'
import * as cookieParser from 'cookie-parser'
import * as errorHandler from 'errorhandler'

module.exports = function (app: Express.Application) {
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
      secret: 'Super Secret Session Key',
      saveUninitialized: false,
      resave: false,
    }),
  )
  // Use the passport package in our application
  app.use(passport.initialize())
  app.use(passport.session())

  // Passport configuration
  require('./auth')

  const router = Express.Router()

  // Create endpoint handlers for oauth2 authorize
  router
    .route('/oauth2/authorize')
    .get(routes.oauth2.authorization)
    .post(routes.oauth2.decision)
  // Create endpoint handlers for oauth2 token
  router.route('/oauth2/token').post(routes.oauth2.token)
  app.use('/api', router)
}

import * as Express from 'express'
import * as session from 'express-session'
import * as _ from 'lodash'
import * as passport from 'passport'

module.exports = function (app: Express.Application) {
  app.use(Express.json())
  app.use(
    Express.urlencoded({
      extended: true,
    }),
  )
  app.use(
    session({
      secret: 'Super Secret Session Key',
      saveUninitialized: true,
      resave: true,
    }),
  )
  // Use the passport package in our application
  app.use(passport.initialize())
  const router = Express.Router()

  router.route('/oauth/')
  // Create endpoint handlers for oauth2 authorize
  router
    .route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision)
  // Create endpoint handlers for oauth2 token
  router
    .route('/oauth2/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token)
}

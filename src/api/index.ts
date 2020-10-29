import * as Express from 'express'
import * as session from 'express-session'
import * as _ from 'lodash'
import * as passport from 'passport'
import * as routes from './controllers'
import * as cookieParser from 'cookie-parser'
import * as errorHandler from 'errorhandler'
import * as path from 'path'
var express = require('express')

module.exports = function (app: Express.Application) {
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
  // site

  router.get('/', routes.site.index)
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
  app.use('/api', router)
}

import { compare } from 'bcryptjs'
import login from 'connect-ensure-login'
import moment from 'moment-timezone'
import OAuth2Server from 'oauth2-server'
import passport from 'passport'
import { prisma } from '../../context'

const oauth = new OAuth2Server({
  model: require('./model'),
})

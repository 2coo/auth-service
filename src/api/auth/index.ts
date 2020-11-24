import { AccountStatusType, User } from '@prisma/client'
import { compare } from 'bcryptjs'
import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password'
import {
  getClientById,
  getUserById,
  getUserByUsernameOrEmail,
} from './../controllers/utils'

passport.use(
  new LocalStrategy(
    { usernameField: 'username' },
    async (username, password, done) => {
      getUserByUsernameOrEmail(username)
        .then(async (user) => {
          if (
            !user ||
            (user && user.accountStatusType === AccountStatusType.DISABLED)
          ) {
            return done(null, false)
          }
          const passwordValid = await compare(password, user.password)
          if (!passwordValid) {
            return done(null, false)
          }
          return done(null, user)
        })
        .catch((error) => done(error))
    },
  ),
)

passport.serializeUser((user: User, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id: string, done) => {
  getUserById(id)
    .then((user) => {
      if (
        !user ||
        (user && user.accountStatusType === AccountStatusType.DISABLED)
      ) {
        return done(null, false)
      }
      return done(null, user)
    })
    .catch((error) => done(error))
})

function verifyClient(clientId: string, clientSecret: string, done: any) {
  getClientById(clientId)
    .then((client) => {
      if (!client) return done(null, false)
      // if (!client.trustedClient) return done(null, false)
      if (client.secret === clientSecret) return done(null, client)
      return done(null, client)
    })
    .catch((error) => done(error))
}

passport.use(new BasicStrategy(verifyClient))

passport.use('clientPassword', new ClientPasswordStrategy(verifyClient))

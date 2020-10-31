import { queryType } from '@nexus/schema'
import moment = require('moment-timezone')
export const Query = queryType({
  definition(t) {
    t.crud.user()
    t.crud.users()
    t.crud.oAuthClient()
    t.crud.oAuthClients()
    t.crud.oAuthAuthorizationCode()
    t.crud.oAuthGrants()
    t.crud.oAuthAccessToken()
    t.crud.oAuthRefreshToken()
  },
})

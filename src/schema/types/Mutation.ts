import * as schema from '@nexus/schema'
import moment = require('moment-timezone')

export const Mutation = schema.mutationType({
  definition(t) {
    t.crud.createOneoAuthClient()
    t.crud.createOneUser()
  },
})

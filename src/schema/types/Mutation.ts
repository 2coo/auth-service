import * as schema from '@nexus/schema'
import moment = require('moment-timezone')

export const Mutation = schema.mutationType({
  definition(t) {
    t.crud.deleteOneUser()
    t.crud.updateOneUser()
  },
})

import { mutationType } from '@nexus/schema'
import moment = require('moment-timezone')

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneoAuthClient()
    t.crud.createOneUser()
  },
})

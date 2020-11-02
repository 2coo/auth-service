import { objectType } from '@nexus/schema'

export const Organization = objectType({
  name: 'Organization',
  definition(t) {
    t.model.name()
    t.model.address()
    t.model.UserPools()
  },
})

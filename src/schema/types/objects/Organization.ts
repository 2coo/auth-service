import { objectType } from '@nexus/schema'

export const Organization = objectType({
  name: 'Organization',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.url()
    t.model.phoneNumber()
    t.model.address()
    t.model.UserPools()
  },
})

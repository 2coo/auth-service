import { objectType } from '@nexus/schema'

export const AccessToken = objectType({
  name: 'AccessToken',
  definition(t) {
    t.model.expirationDate()
    t.model.User()
    t.model.Application()
    t.model.createdAt()
  },
})

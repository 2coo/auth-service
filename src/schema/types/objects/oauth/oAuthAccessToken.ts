import { objectType } from '@nexus/schema'

export const oAuthAccessToken = objectType({
  name: 'oAuthAccessToken',
  definition(t) {
    t.model.expirationDate()
    t.model.Scopes()
    t.model.User()
    t.model.Client()
    t.model.createdAt()
  },
})

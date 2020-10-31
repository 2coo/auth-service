import { objectType } from '@nexus/schema'

export const oAuthAccessToken = objectType({
  name: 'oAuthAccessToken',
  definition(t) {
    t.model.accessToken()
    t.model.expirationDate()
    t.model.scopes()
    t.model.user()
    t.model.client()
    t.model.createdAt()
  },
})

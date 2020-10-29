import * as schema from '@nexus/schema'

export const oAuthRefreshToken = schema.objectType({
  name: 'oAuthRefreshToken',
  definition(t) {
    t.model.refreshToken()
    t.model.expirationDate()
    t.model.createdAt()
  },
})

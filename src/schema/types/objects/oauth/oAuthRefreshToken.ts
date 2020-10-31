import { objectType } from '@nexus/schema'

export const oAuthRefreshToken = objectType({
  name: 'oAuthRefreshToken',
  definition(t) {
    t.model.refreshToken()
    t.model.expirationDate()
    t.model.createdAt()
  },
})

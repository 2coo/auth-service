import { objectType } from 'nexus'

export const RefreshToken = objectType({
  name: 'RefreshToken',
  definition(t) {
    t.model.refreshToken()
    t.model.expirationDate()
    t.model.createdAt()
  },
})

import { objectType } from '@nexus/schema'

export const oAuthAuthorizationCode = objectType({
  name: 'oAuthAuthorizationCode',
  definition(t) {
    t.model.code()
    t.model.redirectURI()
    t.model.expirationDate()
    t.model.scopes()
    t.model.user()
    t.model.client()
    t.model.createdAt()
  },
})

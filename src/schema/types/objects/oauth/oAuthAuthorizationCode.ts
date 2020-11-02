import { objectType } from '@nexus/schema'

export const oAuthAuthorizationCode = objectType({
  name: 'oAuthAuthorizationCode',
  definition(t) {
    t.model.code()
    t.model.redirectURI()
    t.model.expirationDate()
    t.model.Scopes()
    t.model.User()
    t.model.Client()
    t.model.createdAt()
  },
})

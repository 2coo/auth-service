import { objectType } from 'nexus'

export const AuthorizationCode = objectType({
  name: 'AuthorizationCode',
  definition(t) {
    t.model.code()
    t.model.redirectURI()
    t.model.expirationDate()
    t.model.Scopes()
    t.model.User()
    t.model.Application()
    t.model.createdAt()
  },
})

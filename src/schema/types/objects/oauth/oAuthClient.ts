import { objectType } from '@nexus/schema'

export const oAuthClient = objectType({
  name: 'oAuthClient',
  definition(t) {
    t.model.id()
    t.model.scopes()
    t.model.name()
    t.model.grants()
    t.model.isTrusted()
    t.model.idTokenLifetime()
    t.model.accessTokenLifetime()
    t.model.refreshTokenLifetime()
    t.model.redirectUris()
    t.model.javascriptOrigins()
    t.model.authorizationCodes()
    t.model.accessTokens()
    t.model.refreshTokens()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

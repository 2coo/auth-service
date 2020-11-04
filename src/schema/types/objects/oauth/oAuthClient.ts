import { objectType } from '@nexus/schema'

export const oAuthClient = objectType({
  name: 'oAuthClient',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.secret()
    t.model.UserPool()
    t.model.Scopes()
    t.model.Grants()
    t.model.isTrusted()
    t.model.idTokenLifetime()
    t.model.accessTokenLifetime()
    t.model.refreshTokenLifetime()
    t.model.RedirectUris()
    t.model.JavascriptOrigins()
    t.model.AuthorizationCodes()
    t.model.AccessTokens()
    t.model.RefreshTokens()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

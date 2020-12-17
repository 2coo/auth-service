import { objectType } from 'nexus'

export const Application = objectType({
  name: 'Application',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.secret()
    t.model.Registrations()
    t.model.Roles()
    t.model.EnabledScopes()
    t.model.Grants()
    t.model.trustedApplication()
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

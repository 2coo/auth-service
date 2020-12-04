import { objectType } from '@nexus/schema'

export const IdentityProvider = objectType({
  name: 'IdentityProvider',
  definition(t) {
    t.model.cliendId()
    t.model.clientSecret()
    t.model.providerType()
    t.model.Applications()
    t.model.ExternalIdentities()
    t.model.authorizationUrl()
    t.model.tokenUrl()
    t.model.issuer()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

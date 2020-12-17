import { objectType } from 'nexus'

export const IdentityProvider = objectType({
  name: 'IdentityProvider',
  definition(t) {
    t.model.isEnabled()
    t.model.providerType()
    t.model.data()
    t.model.ExternalIdentifiers()
    t.model.Applications()
    t.model.ExternalIdentifiers()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

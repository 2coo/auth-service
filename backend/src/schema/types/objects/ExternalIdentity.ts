import { objectType } from '@nexus/schema'

export const ExternalIdentity = objectType({
  name: 'ExternalIdentity',
  definition(t) {
    t.model.sub()
    t.model.providerType()
    t.model.status()
    t.model.isUserCreatedBefore()
    t.model.User()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

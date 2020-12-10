import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.Tenant()
    t.model.ExternalIdentifiers()
    t.model.Registrations()
    t.model.username()
    t.model.accountStatusType()
    t.model.email()
    t.model.Groups()
    t.model.Profile()
    t.model.Groups()
    t.model.Devices()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

import { objectType } from '@nexus/schema'

export const Tenant = objectType({
  name: 'Tenant',
  definition(t) {
    t.model.id()
    t.model.domainName()
    t.model.isAcitve()
    t.model.Applications()
    t.model.EmailSettings()
    t.model.Groups()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

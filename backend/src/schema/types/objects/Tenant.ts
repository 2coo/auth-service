import { objectType } from 'nexus'

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

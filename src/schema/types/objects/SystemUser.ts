import { objectType } from '@nexus/schema'

export const SystemUser = objectType({
  name: 'SystemUser',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.email()
    t.model.role()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

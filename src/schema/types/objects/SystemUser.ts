import { objectType } from '@nexus/schema'

export const SystemUser = objectType({
  name: 'SystemUser',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.email()
    t.model.SystemRole()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

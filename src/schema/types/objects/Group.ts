import { objectType } from '@nexus/schema'

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.model.name()
    t.model.description()
    t.model.Users()
    t.model.Roles()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

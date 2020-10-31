import { objectType } from '@nexus/schema'

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.model.name()
    t.model.description()
    t.model.users()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

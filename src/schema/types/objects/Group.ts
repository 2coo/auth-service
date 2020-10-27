import * as schema from '@nexus/schema'

export const Group = schema.objectType({
  name: 'Group',
  definition(t) {
    t.model.name()
    t.model.description()
    t.model.users()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

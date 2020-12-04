import { objectType } from '@nexus/schema'

export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.model.permissions()
    t.model.Registrations()
    t.model.Groups()
    t.model.ParentRoles()
    t.model.ChildRoles()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

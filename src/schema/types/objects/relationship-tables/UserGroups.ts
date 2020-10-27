import * as schema from '@nexus/schema'

export const UserGroups = schema.objectType({
  name: 'UserGroups',
  definition(t) {
    t.model.user()
    t.model.group()
  },
})

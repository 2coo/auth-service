import * as schema from '@nexus/schema'

export const UserGroup = schema.objectType({
  name: 'UserGroup',
  definition(t) {
    t.model.user()
    t.model.group()
  },
})

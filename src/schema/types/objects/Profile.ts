import * as schema from '@nexus/schema'

export const Profile = schema.objectType({
  name: 'Profile',
  definition(t) {
    t.model.user()
  },
})

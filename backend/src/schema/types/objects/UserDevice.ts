import { objectType } from '@nexus/schema'

export const UserDevice = objectType({
  name: 'UserDevice',
  definition(t) {
    t.model.User()
  },
})

import { objectType } from 'nexus'

export const UserDevice = objectType({
  name: 'UserDevice',
  definition(t) {
    t.model.User()
  },
})

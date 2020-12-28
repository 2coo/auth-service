import { objectType } from 'nexus'

export const UserCustomAttribute = objectType({
  name: 'UserCustomAttribute',
  definition(t) {
    t.model.Profile()
    t.model.name()
    t.model.value()
  },
})

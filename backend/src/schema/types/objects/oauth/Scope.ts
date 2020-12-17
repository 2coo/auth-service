import { objectType } from 'nexus'

export const Scope = objectType({
  name: 'Scope',
  definition(t) {
    t.model.name()
    t.model.description()
  },
})

import { objectType } from '@nexus/schema'

export const Scope = objectType({
  name: 'Scope',
  definition(t) {
    t.model.name()
    t.model.description()
  },
})

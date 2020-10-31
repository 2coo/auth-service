import { objectType } from '@nexus/schema'

export const oAuthScope = objectType({
  name: 'oAuthScope',
  definition(t) {
    t.model.name()
    t.model.description()
  },
})

import * as schema from '@nexus/schema'

export const oAuthScope = schema.objectType({
  name: 'oAuthScope',
  definition(t) {
    t.model.name()
    t.model.description()
  },
})

import * as schema from '@nexus/schema'

export const oAuthClientScope = schema.objectType({
  name: 'oAuthClientScope',
  definition(t) {
    t.model.client()
    t.model.scope()
    t.model.createdAt()
  },
})

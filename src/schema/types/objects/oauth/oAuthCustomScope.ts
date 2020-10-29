import * as schema from '@nexus/schema'

export const oAuthCustomScope = schema.objectType({
  name: 'oAuthCustomScope',
  definition(t) {
    t.model.name()
    t.model.description()
    t.model.resourceServer()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

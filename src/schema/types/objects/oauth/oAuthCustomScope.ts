import { objectType } from '@nexus/schema'

export const oAuthCustomScope = objectType({
  name: 'oAuthCustomScope',
  definition(t) {
    t.model.name()
    t.model.description()
    t.model.resourceServer()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

import { objectType } from '@nexus/schema'

export const ResourceServer = objectType({
  name: 'ResourceServer',
  definition(t) {
    t.model.name()
    t.model.identifier()
    t.model.Scopes()
    t.model.createdAt()
  },
})

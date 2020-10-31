import { objectType } from '@nexus/schema'

export const oAuthResourceServer = objectType({
  name: 'oAuthResourceServer',
  definition(t) {
    t.model.name()
    t.model.identifier()
    t.model.scopes()
    t.model.createdAt()
  },
})

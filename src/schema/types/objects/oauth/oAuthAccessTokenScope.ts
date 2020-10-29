import * as schema from '@nexus/schema'

export const oAuthAccessTokenScope = schema.objectType({
  name: 'oAuthAccessTokenScope',
  definition(t) {
    t.model.accessToken()
    t.model.scope()
    t.model.createdAt()
  },
})

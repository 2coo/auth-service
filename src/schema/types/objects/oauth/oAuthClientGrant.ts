import * as schema from '@nexus/schema'

export const oAuthClientGrant = schema.objectType({
  name: 'oAuthClientGrant',
  definition(t) {
    t.model.client()
    t.model.grant()
    t.model.createdAt()
  },
})

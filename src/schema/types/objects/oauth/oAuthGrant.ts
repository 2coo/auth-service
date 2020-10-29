import * as schema from '@nexus/schema'

export const oAuthGrant = schema.objectType({
  name: 'oAuthGrant',
  definition(t) {
    t.model.grantType()
    t.model.createdAt()
  },
})

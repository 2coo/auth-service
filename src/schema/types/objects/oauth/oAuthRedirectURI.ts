import * as schema from '@nexus/schema'

export const oAuthRedirectURI = schema.objectType({
  name: 'oAuthRedirectURI',
  definition(t) {
    t.model.url()
    t.model.createdAt()
  },
})

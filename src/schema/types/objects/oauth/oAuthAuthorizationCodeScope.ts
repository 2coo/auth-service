import * as schema from '@nexus/schema'

export const oAuthAuthorizationCodeScope = schema.objectType({
  name: 'oAuthAuthorizationCodeScope',
  definition(t) {
    t.model.scope()
    t.model.authorizationCode()
    t.model.createdAt()
  },
})

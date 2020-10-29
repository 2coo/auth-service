import * as schema from '@nexus/schema'

export const oAuthRefreshTokenScope = schema.objectType({
  name: 'oAuthRefreshTokenScope',
  definition(t) {
    t.model.scope()
    t.model.refreshToken()
  },
})

import { objectType } from '@nexus/schema'

export const oAuthGrant = objectType({
  name: 'oAuthGrant',
  definition(t) {
    t.model.grantType()
    t.model.createdAt()
  },
})

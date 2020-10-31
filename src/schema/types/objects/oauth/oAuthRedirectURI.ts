import { objectType } from '@nexus/schema'

export const oAuthRedirectURI = objectType({
  name: 'oAuthRedirectURI',
  definition(t) {
    t.model.url()
    t.model.createdAt()
  },
})

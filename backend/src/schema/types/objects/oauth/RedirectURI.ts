import { objectType } from '@nexus/schema'

export const RedirectURI = objectType({
  name: 'RedirectURI',
  definition(t) {
    t.model.url()
    t.model.createdAt()
  },
})

import { objectType } from 'nexus'

export const RedirectURI = objectType({
  name: 'RedirectURI',
  definition(t) {
    t.model.url()
    t.model.createdAt()
  },
})

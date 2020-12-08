import { objectType } from '@nexus/schema'

export const JavascriptOrigin = objectType({
  name: 'JavascriptOrigin',
  definition(t) {
    t.model.uri()
    t.model.createdAt()
  },
})

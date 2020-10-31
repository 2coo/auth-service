import { objectType } from '@nexus/schema'

export const oAuthJavascriptOrigin = objectType({
  name: 'oAuthJavascriptOrigin',
  definition(t) {
    t.model.uri()
    t.model.createdAt()
  },
})

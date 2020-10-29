import * as schema from '@nexus/schema'

export const oAuthJavascriptOrigin = schema.objectType({
  name: 'oAuthJavascriptOrigin',
  definition(t) {
    t.model.uri()
    t.model.createdAt()
  },
})

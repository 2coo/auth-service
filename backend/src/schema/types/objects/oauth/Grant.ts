import { objectType } from '@nexus/schema'

export const Grant = objectType({
  name: 'Grant',
  definition(t) {
    t.model.grantType()
    t.model.createdAt()
  },
})

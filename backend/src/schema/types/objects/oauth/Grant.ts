import { objectType } from 'nexus'

export const Grant = objectType({
  name: 'Grant',
  definition(t) {
    t.model.grantType()
    t.model.createdAt()
  },
})

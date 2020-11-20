import { objectType } from '@nexus/schema'

export const Identity = objectType({
  name: 'Identity',
  definition(t) {
    t.model.sub()
    t.model.provider()
    t.model.status()
    t.model.isUserCreatedBefore()
    t.model.User()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

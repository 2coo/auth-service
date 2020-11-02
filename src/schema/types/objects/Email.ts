import { objectType } from '@nexus/schema'

export const Email = objectType({
  name: 'Email',
  definition(t) {
    t.model.email()
    t.model.PrimaryEmailOf()
    t.model.User()
    t.model.isVerified()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

import { objectType } from 'nexus'

export const Registration = objectType({
  name: 'Registration',
  definition(t) {
    t.model.User()
    t.model.Application()
    t.model.Roles()
    t.model.username()
    t.model.isVerified()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

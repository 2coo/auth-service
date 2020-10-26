import * as schema from '@nexus/schema'

export const User = schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.email()
    t.model.firstName()
    t.model.lastName()
    t.model.gender()
    t.model.picture()
    t.model.birthdate()
    t.model.score()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

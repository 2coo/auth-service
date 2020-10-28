import * as schema from '@nexus/schema'

export const Profile = schema.objectType({
  name: 'Profile',
  definition(t) {
    t.model.firstName()
    t.model.lastName()
    t.model.displayName()
    t.model.birthdate()
    t.model.gender()
    t.model.image()
    t.model.mobileNumber()
    t.model.user()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

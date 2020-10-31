import { objectType } from '@nexus/schema'

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.model.firstName()
    t.model.lastName()
    t.model.displayName()
    t.model.birthdate()
    t.model.gender()
    t.model.currentProfileImage()
    t.model.photos()
    t.model.mobileNumber()
    t.model.user()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

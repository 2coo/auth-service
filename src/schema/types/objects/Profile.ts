import { objectType } from '@nexus/schema'

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.model.firstName()
    t.model.lastName()
    t.model.displayName()
    t.model.birthdate()
    t.model.gender()
    t.model.profilePicture()
    t.model.User()
    t.model.mobileNumber()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

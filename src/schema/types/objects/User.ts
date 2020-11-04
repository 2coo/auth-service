import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.sub()
    t.model.username()
    t.model.email()
    t.model.isExternalProvider()
    t.model.Profile()
    t.model.Groups()
    t.model.Roles()
    t.model.Devices()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

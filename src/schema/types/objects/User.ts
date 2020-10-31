import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  definition(t){
      t.model.email()
      t.model.username()
      t.model.profile()
      t.model.groups()
      t.model.role()
      t.model.createdAt()
      t.model.updatedAt()
  }
})
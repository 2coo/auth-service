import * as schema from '@nexus/schema'

export const User = schema.objectType({
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
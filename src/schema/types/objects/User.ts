import * as schema from '@nexus/schema'

export const User = schema.objectType({
  name: 'User',
  definition(t){
      t.model.id()
      t.model.email()
      t.model.username()
      t.model.profile()
      t.model.groups()
      t.model.createdAt()
      t.model.updatedAt()
  }
})
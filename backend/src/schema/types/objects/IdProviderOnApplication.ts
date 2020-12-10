import { objectType } from '@nexus/schema'

export const IdProviderOnApplication = objectType({
  name: 'IdProviderOnApplication',
  definition(t){
      t.model.Application()
      t.model.IdentityProvider()
      t.model.isEnabled()
      t.model.isOverwritten()
      t.model.data()
      t.model.providerType()
      t.model.createdAt()
      t.model.updatedAt()
  }
})
import { objectType } from 'nexus'

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
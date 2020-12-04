import { objectType } from '@nexus/schema'

export const EmailSettings = objectType({
  name: 'EmailSettings',
  definition(t) {
    t.model.id()
    t.model.SMTPSecurity()
    t.model.host()
    t.model.port()
    t.model.username()
    t.model.password()
    t.model.from()
    t.model.name()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

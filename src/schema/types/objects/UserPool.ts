import { objectType } from '@nexus/schema'

export const UserPool = objectType({
  name: 'UserPool',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.Organization()
    t.model.Clients()
    t.model.ResourceServers()
    t.model.Roles()
    t.model.Users()
    t.model.Groups()
  },
})

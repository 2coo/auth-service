import * as schema from '@nexus/schema'

export const SystemRole = schema.enumType({
  name: 'SystemRole',
  members: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'USER'],
  description: 'Roles of oauth system',
})

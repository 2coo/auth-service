import { enumType } from '@nexus/schema'

export const SystemRole = enumType({
  name: 'SystemRole',
  members: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AUDITOR'],
})

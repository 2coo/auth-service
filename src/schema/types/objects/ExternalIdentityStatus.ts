import { enumType } from '@nexus/schema'

export const ExternalIdentityStatus = enumType({
  name: 'ExternalIdentityStatus',
  members: ['UNCONFIRMED', "CONFIRMED", 'DISABLED'],
  description: 'Status of external identity',
})

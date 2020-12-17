import { enumType } from 'nexus'

export const ExternalIdentityStatus = enumType({
  name: 'ExternalIdentityStatus',
  members: ['UNCONFIRMED', "CONFIRMED", 'DISABLED'],
  description: 'Status of external identity',
})

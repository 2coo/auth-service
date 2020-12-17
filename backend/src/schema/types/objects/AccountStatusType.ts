import { enumType } from 'nexus'

export const AccountStatusType = enumType({
  name: 'AccountStatusType',
  members: [
    'UNCONFIRMED',
    'CONFIRMED',
    'ARCHIVED',
    'COMPROMISED',
    'UNKNOWN',
    'RESET_REQUIRED',
    'FORCE_CHANGE_PASSWORD',
    'DISABLED',
  ],
  description: 'Account status of users',
})

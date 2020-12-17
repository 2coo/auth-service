import { enumType } from 'nexus'

export const GrantType = enumType({
  name: 'GrantType',
  description: '',
  members: [
    'AUTHORIZATION_CODE',
    'PASSWORD',
    'REFRESH_TOKEN',
    'CLIENT_CREDENTIALS',
    'EXTENSION',
  ],
})

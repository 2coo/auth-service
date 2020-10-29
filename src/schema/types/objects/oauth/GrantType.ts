import * as schema from '@nexus/schema'

export const GrantType = schema.enumType({
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

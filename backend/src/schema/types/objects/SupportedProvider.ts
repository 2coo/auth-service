import { enumType } from 'nexus'

export const SupportedProvider = enumType({
  name: 'SupportedProvider',
  members: ['GOOGLE', 'FACEBOOK', 'APPLE'],
  description: 'Supported providers',
})

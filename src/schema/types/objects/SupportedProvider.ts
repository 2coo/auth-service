import { enumType } from '@nexus/schema'

export const SupportedProvider = enumType({
  name: 'SupportedProvider',
  members: ['GOOGLE', 'FACEBOOK', 'APPLE'],
  description: 'Supported providers',
})

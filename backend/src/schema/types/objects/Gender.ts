import { enumType } from '@nexus/schema'

export const Gender = enumType({
  name: 'Gender',
  members: ['MALE', 'FEMALE', 'OTHER'],
  description: 'Gender of users',
})

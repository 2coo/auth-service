import { enumType } from 'nexus'

export const Gender = enumType({
  name: 'Gender',
  members: ['MALE', 'FEMALE', 'OTHER'],
  description: 'Gender of users',
})

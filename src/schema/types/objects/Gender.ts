import * as schema from '@nexus/schema'

export const Gender = schema.enumType({
  name: 'Gender',
  members: ['MALE', 'FEMALE', 'OTHER'],
  description: 'Gender of users',
})

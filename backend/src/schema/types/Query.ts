import { PrismaClient } from '@prisma/client'
import { queryType } from 'nexus'
export const Query = queryType({
  definition(t) {
    t.field('Test', {
      type: 'String',
      resolve: async (_parent, args, { prisma }, info) => {
        return 'Hi'
      },
    })
    t.crud.user()
    t.crud.users({
      filtering: true,
      ordering: true
    })
  },
})

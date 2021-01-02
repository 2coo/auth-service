import { PrismaClient } from '@prisma/client'
import { queryType } from 'nexus'
export const Query = queryType({
  definition(t) {
    t.field('Test', {
      type: 'User',
      resolve: async (_parent, args, { prisma }, info) => {
        return await prisma.user.findUnique({
          where: {
            username: 'admin',
          },
        })
      },
    })
    t.crud.user()
    t.crud.users({
      filtering: true,
      ordering: true
    })
  },
})

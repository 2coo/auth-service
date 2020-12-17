import { queryType } from 'nexus'
import moment = require('moment-timezone')
export const Query = queryType({
  definition(t) {
    t.nullable.field('me', {
      type: 'User',
      resolve: async (_parent, args, ctx) => {
        if (ctx.auth.userId) {
          const user = await ctx.prisma.user.findUnique({
            where: {
              id: ctx.auth.userId,
            },
          })
          return user
        }
        return null
      },
    })
  },
})

import { queryType } from 'nexus'
import moment = require('moment-timezone')
export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: async (_parent, args, ctx) => {
        if (ctx.auth.userId) {
          const user = await ctx.prisma.user.findOne({
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

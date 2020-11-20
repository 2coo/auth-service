import { queryType } from '@nexus/schema'
import moment = require('moment-timezone')
export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'SystemUser',
      nullable: true,
      resolve: async (_parent, args, ctx) => {
        if (ctx.auth.userId) {
          const user = await ctx.prisma.systemUser.findOne({
            where: {
              id: ctx.auth.userId,
            },
          })
          return user
        }
        return null
      },
    }),
      t.crud.oAuthClient(),
      t.crud.users(),
      t.crud.roles(),
      t.crud.group()
  },
})

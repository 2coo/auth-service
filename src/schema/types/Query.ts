import * as schema from '@nexus/schema'
import moment = require('moment-timezone')
export const Query = schema.queryType({
  definition(t) {
    t.crud.user()
    t.crud.users({ filtering: true, ordering: true, pagination: true })
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findOne({
          where: { email: ctx.auth.email },
        })
      },
    })
  },
})

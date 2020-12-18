import { queryType } from 'nexus'
export const Query = queryType({
  definition(t) {
    t.field('test', {
      type: 'String',
      resolve: async (_parent, args, ctx) => {
        return 'Hi'
      },
    })
  },
})

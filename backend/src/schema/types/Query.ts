import { queryType } from 'nexus'
export const Query = queryType({
  definition(t) {
    t.field('Test', {
      type: 'String',
      resolve: async (_parent, args, ctx) => {
        return 'Surprise! Magic!'
      },
    })
  },
})

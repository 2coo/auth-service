import { rule, shield } from 'graphql-shield'
import { getUserEmail } from '../utils'

const rules: any = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserEmail(context)
    return Boolean(userId)
  }),
  isPostOwner: rule()(async (parent, { id }, context) => {
    const userId = getUserEmail(context)
    const author = await context.prisma.post
      .findOne({
        where: {
          id: Number(id),
        },
      })
      .author()
    return userId === author.id
  }),
}

export const permissions = shield(
  {
    Query: {},
    Mutation: {},
  },
  {
    allowExternalErrors: true,
  },
)

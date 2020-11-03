import { rule, shield } from 'graphql-shield'
import { Context } from '../context'
import { getUserId } from '../utils'

const rules: any = {
  isAuthenticatedUser: rule()((parent, args, context: Context) => {
    const userId = context.auth.userId
    return Boolean(userId)
  }),
}

export const permissions = shield(
  {
    Query: {},
    Mutation: {},
  },
  {
    allowExternalErrors: true,
    fallbackRule: rules.isAuthenticateUser,
  },
)

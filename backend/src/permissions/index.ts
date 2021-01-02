import { allow, and, shield } from 'graphql-shield'
import { isAuthenticated } from './is-authenticated'
import { can } from './rules'

export const permissions = shield(
  {
    Query: {
      // Test: and(isAuthenticated, can('read', 'Test')),
      Test: allow,
    },
    Mutation: {},
  },
  {
    allowExternalErrors: true,
  },
)

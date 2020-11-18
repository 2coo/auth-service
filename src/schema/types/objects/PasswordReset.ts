import { objectType } from '@nexus/schema'

export const PasswordReset = objectType({
  name: 'PasswordReset',
  definition(t) {
    t.model.User()
  },
})

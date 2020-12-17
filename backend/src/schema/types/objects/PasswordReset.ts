import { objectType } from 'nexus'

export const PasswordReset = objectType({
  name: 'PasswordReset',
  definition(t) {
    t.model.User()
  },
})

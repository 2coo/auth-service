import { mutationType, nonNull, stringArg } from 'nexus'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export const Mutation = mutationType({
  definition(t) {
    t.nullable.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, { email, password }, ctx) {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, '1231', {
            expiresIn: '1 day',
          }),
          user: user,
        }
      },
    })
    t.crud.createOneUser()
  },
})

import { mutationType, stringArg } from '@nexus/schema'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneoAuthClient(),
      t.crud.createOneUser(),
      t.crud.updateOneUser(),
      t.crud.deleteOneUser(),
      t.crud.createOneoAuthRedirectURI(),
      t.crud.updateOneoAuthClient(),
      t.field('login', {
        type: 'AuthPayload',
        args: {
          email: stringArg({ nullable: false }),
          password: stringArg({ nullable: false }),
        },
        nullable: true,
        async resolve(_parent, { email, password }, ctx) {
          const user = await ctx.prisma.systemUser.findOne({
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
            token: sign({ userId: user.id }, process.env.APP_SECRET as string, {
              expiresIn: '1 day',
            }),
            user: user,
          }
        },
      })
  },
})

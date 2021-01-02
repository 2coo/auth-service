import { PrismaClient, Scope } from '@prisma/client'

export const seedDefaultScopes = async (prisma: PrismaClient) => {
  const scope1 = prisma.scope.create({
    data: {
      name: 'openid',
      description: 'OpenID Connect scope for id_token',
    },
  })
  const scope2 = prisma.scope.create({
    data: {
      name: 'email',
      description: "The email scope grants access to the email and email_verified claims. This scope can only be requested with the openid scope.",
    },
  })
  const scope3 = prisma.scope.create({
    data: {
      name: 'profile',
      description: "The profile scope grants access to all user attributes. This scope can only be requested with the openid scope.",
    },
  })
  const scope4 = prisma.scope.create({
    data: {
      name: 'user.admin',
      description: 'The user.admin scope grants access to the user own data.',
    },
  })

  return [scope1, scope2, scope3, scope4]
}

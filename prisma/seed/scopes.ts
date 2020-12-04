import { PrismaClient, Scope } from '@prisma/client'

export const seedDefaultScopes = (prisma: PrismaClient) => {
  const scope1 = prisma.scope.create({
    data: {
      name: 'openid',
      description: 'OpenID Connect scope for id_token',
    },
  })
  const scope2 = prisma.scope.create({
    data: {
      name: 'email',
      description: "OpenID Connect scope for email",
    },
  })
  const scope3 = prisma.scope.create({
    data: {
      name: 'profile',
      description: "OpenID Connect scope for profile",
    },
  })
  const scope4 = prisma.scope.create({
    data: {
      name: 'avig.auth.user.admin',
      description: 'Scope for user to manage his own user data',
    },
  })

  return [scope1, scope2, scope3, scope4]
}

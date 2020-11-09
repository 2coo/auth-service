import { PrismaClient, oAuthScope } from '@prisma/client'

export const seedDefaultScopes = (
  prisma: PrismaClient,
) => {
  const scope1 = prisma.oAuthScope.create({
    data: {
      name: 'user',
      description: 'Grants read/write access to own profile info only',
    },
  })
  const scope2 = prisma.oAuthScope.create({
    data: {
      name: 'read:user',
      description: "Grants access to read a user's profile data.",
    },
  })
  const scope3 = prisma.oAuthScope.create({
    data: {
      name: 'user:email',
      description: "Grants read access to a user's email addresses.",
    },
  })
  const scope4 = prisma.oAuthScope.create({
    data: {
      name: 'user:follow',
      description: 'Grants access to follow or unfollow other users.',
    },
  })

  return [scope1, scope2, scope3, scope4]
}

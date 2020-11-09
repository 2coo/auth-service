import { PrismaClient, oAuthScope } from '@prisma/client'

export const seedDefaultScopes = async (
  prisma: PrismaClient,
): Promise<oAuthScope[]> => {
  const scope1 = prisma.oAuthScope.create({
    data: {
      name: 'user',
    },
  })
  const scope2 = prisma.oAuthScope.create({
    data: {
      name: 'read:user',
    },
  })
  const scope3 = prisma.oAuthScope.create({
    data: {
      name: 'user:email',
    },
  })
  const scope4 = prisma.oAuthScope.create({
    data: {
      name: 'user:follow',
    },
  })

  return prisma.$transaction([scope1, scope2, scope3, scope4])
}

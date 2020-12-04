import { PrismaClient, GrantType, Grant } from '@prisma/client'
export const defaultGrantTypes = [
  { grantType: GrantType.AUTHORIZATION_CODE },
  { grantType: GrantType.CLIENT_CREDENTIALS },
  { grantType: GrantType.PASSWORD },
  { grantType: GrantType.REFRESH_TOKEN },
  { grantType: GrantType.EXTENSION },
]
export const seedDefaultGrantTypes = async (
  prisma: PrismaClient,
): Promise<Grant[]> => {
  const grantTypes = defaultGrantTypes.map(({ grantType }) =>
    prisma.grant.create({
      data: {
        grantType: grantType,
      },
    }),
  )
  return prisma.$transaction(grantTypes)
}

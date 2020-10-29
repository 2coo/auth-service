import { PrismaClient, GrantType } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  const type1 = prisma.oAuthGrant.create({
    data: {
      grantType: GrantType.AUTHORIZATION_CODE,
    },
  })
  const type2 = prisma.oAuthGrant.create({
    data: {
      grantType: GrantType.CLIENT_CREDENTIALS,
    },
  })
  const type3 = prisma.oAuthGrant.create({
    data: {
      grantType: GrantType.EXTENSION,
    },
  })
  const type4 = prisma.oAuthGrant.create({
    data: {
      grantType: GrantType.PASSWORD,
    },
  })
  const type5 = prisma.oAuthGrant.create({
    data: {
      grantType: GrantType.REFRESH_TOKEN,
    },
  })
  await prisma.$transaction([type1, type2, type3, type4, type5])
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

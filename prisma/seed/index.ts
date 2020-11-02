import { PrismaClient } from '@prisma/client'
import { seedGrantTypes } from './granttypes'
import { seedSystemUser } from './organization'
const prisma = new PrismaClient()

async function seed() {
  const grantTypes = seedGrantTypes(prisma)
  const systemUser = seedSystemUser(prisma)
  await prisma.$transaction([grantTypes, systemUser])
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

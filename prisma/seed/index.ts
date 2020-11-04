import { PrismaClient } from '@prisma/client'
import { seedGrantTypes } from './granttypes'
import { seedSystemUser } from './systemUser'

const prisma = new PrismaClient()

async function seed() {
  // await seedGrantTypes(prisma)
  await seedSystemUser(prisma)
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

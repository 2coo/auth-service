import { PrismaClient } from '@prisma/client'
import { seedGrantTypes } from './granttypes'
const prisma = new PrismaClient()

async function seed() {
  await seedGrantTypes(prisma)
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

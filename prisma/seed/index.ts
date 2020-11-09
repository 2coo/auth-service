import { PrismaClient } from '@prisma/client';
import { seedDefaultScopes } from './scopes';
import { seedSystemUser } from './systemUser';


const prisma = new PrismaClient()

async function seed() {
  // await seedGrantTypes(prisma)
  await seedSystemUser(prisma)
  await seedDefaultScopes(prisma)
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

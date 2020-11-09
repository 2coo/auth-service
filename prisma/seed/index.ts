import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
import { seedDefaultScopes } from './scopes'
import { seedSystemUser } from './systemUser'
import { seedTestData } from './testdata'

const prisma = new PrismaClient()

async function seed() {
  let transactions: any = []
  // console.log(seedDefaultScopes(prisma))

  transactions = _.concat(transactions, seedDefaultScopes(prisma))
  if (process.env.NODE_ENV === 'development') {
    await seedSystemUser(prisma)
    transactions = _.concat(transactions, seedTestData(prisma))
  }
  await prisma.$transaction(transactions)
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

import { seedDefaultGrantTypes } from './granttypes'
import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
import { seedDefaultScopes } from './scopes'
import { seedDefaultTenantWithAdmin } from './default'
import { seedTestData } from './test'

const prisma = new PrismaClient()

async function seed() {
  let transactions: any = []
  if (process.env.NODE_ENV === 'development') {
    transactions = _.concat(transactions, seedTestData(prisma))
  } else {
    transactions = _.flattenDeep(
      _.concat(
        transactions,
        seedDefaultGrantTypes(prisma),
        seedDefaultScopes(prisma),
        seedDefaultTenantWithAdmin(prisma),
      ),
    )
  }

  await prisma.$transaction(transactions)
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

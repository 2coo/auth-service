import { seedDefaultGrantTypes } from './granttypes'
import { PrismaClient } from '@prisma/client'
import * as _ from 'lodash'
import { seedDefaultScopes } from './scopes'
import { seedDefaultTenantWithAdmin } from './default'
import { seedTestData } from './test'

main()

async function main() {
  let transactions: any = []
  const prisma = new PrismaClient()
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
  await prisma.$disconnect()
}

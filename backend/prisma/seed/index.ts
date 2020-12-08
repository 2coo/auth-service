import { seedDefaultGrantTypes } from './granttypes'
import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
import { seedDefaultScopes } from './scopes'
import { seedDefaultTenantWithAdmin } from './default'

const prisma = new PrismaClient()

async function seed() {
  let transactions: any = []

  transactions = _.concat(
    transactions,
    seedDefaultGrantTypes(prisma),
    seedDefaultScopes(prisma),
    seedDefaultTenantWithAdmin(prisma),
  )
  if (process.env.NODE_ENV === 'development') {
    // todo
  }
  await prisma.$transaction(transactions)
}

seed()
.catch((e) => console.error(e))
.finally(async () => {
  await prisma.$disconnect()
})

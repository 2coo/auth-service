import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { PubSub } from 'apollo-server-express'
import {
  createGrantTypesAndConnect,
  createRolesAndConnect,
  getUserId,
  Token,
} from './utils'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

prisma.$use(async (params, next) => {
  console.log(params)
  const result = await next(params)
  if (params.model === 'oAuthClient') {
    await createGrantTypesAndConnect(prisma, result.id)
  }
  switch (params.model) {
    case 'oAuthClient':
      await createGrantTypesAndConnect(prisma, result.id)
      break
    case 'UserPool':
      await createRolesAndConnect(prisma, result.id)
      break
  }
  return result
})

export const pubsub = new PubSub()

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
  pubsub: PubSub
  auth: Token
}

export async function createContext(ctx: ExpressContext): Promise<Context> {
  return {
    ...ctx,
    prisma: prisma,
    pubsub,
    auth: getUserId(ctx),
  }
}

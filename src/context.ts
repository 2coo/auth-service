import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { PubSub } from 'apollo-server-express'
import { getUserEmail, Token } from './utils'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
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
    auth: await getUserEmail(ctx),
  }
}

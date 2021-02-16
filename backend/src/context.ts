import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { Request, Response } from 'express'
import { defineSystemAbilitiesFor } from './core/authorization'
import { Await } from './core/types/Awaits'

export const prisma = new PrismaClient()

export const pubsub = new PubSub()

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
  pubsub: PubSub
  ability: Await<ReturnType<typeof defineSystemAbilitiesFor>>
}

export async function createContext(ctx: ExpressContext): Promise<Context> {
  return {
    ...ctx,
    prisma: prisma,
    pubsub,
    ability: await defineSystemAbilitiesFor(ctx.req),
  }
}

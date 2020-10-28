import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { PubSub } from 'graphql-yoga'
import { ContextParameters } from 'graphql-yoga/dist/types'
import { getUserEmail, Token } from './utils'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
const pubsub = new PubSub()

export interface Context {
  prisma: PrismaClient
  request: Request
  response: Response
  pubsub: PubSub
  auth: Token
}

export async function createContext(ctx: ContextParameters) {
  return {
    ...ctx,
    prisma: prisma,
    pubsub,
    auth: getUserEmail(ctx),
  }
}

import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { PubSub } from 'apollo-server-express'
import {
  connectDefaultUserScopes,
  createGrantTypesAndConnect,
  createRolesAndConnect,
  getUserId,
  Token,
} from './utils'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { hash } from 'bcryptjs'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

prisma.$use(async (params, next) => {
  // console.log(params.model, ':', params.action)
  if (params.action === 'create') {
    switch (params.model) {
      case 'User':
        {
          const saltRounds = 10
          params.args.data.password = await hash(
            params.args.data.password,
            saltRounds,
          )
        }
        break
      case 'SystemUser':
        {
          const saltRounds = 10
          params.args.data.password = await hash(
            params.args.data.password,
            saltRounds,
          )
        }
        break
    }
  }
  const result = await next(params)
  switch (params.action) {
    case 'create':
      switch (params.model) {
        case 'UserPool':
          await createRolesAndConnect(prisma, result.id)
          break
        case 'oAuthClient':
          {
            await createGrantTypesAndConnect(prisma, result.id)
            await connectDefaultUserScopes(prisma, result.id)
          }
          break
      }
      break
    case 'update':
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

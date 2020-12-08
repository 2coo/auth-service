import { GrantType, PrismaClient } from '@prisma/client'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { verify } from 'jsonwebtoken'

export interface Token {
  userId: string | null
}

export const getUserId = (context: ExpressContext): Token => {
  const Authorization = context.req.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(
      token,
      process.env.APP_SECRET as string,
    ) as Token
    return verifiedToken
  }
  return { userId: null }
}

export const createGrantTypesAndConnect = async (
  prisma: PrismaClient,
  clientId: string,
) => {
  const grantTypes = [
    { grantType: GrantType.AUTHORIZATION_CODE },
    { grantType: GrantType.CLIENT_CREDENTIALS },
    { grantType: GrantType.EXTENSION },
    { grantType: GrantType.PASSWORD },
    { grantType: GrantType.REFRESH_TOKEN },
  ].map((grantType) => ({
    ...grantType,
    Clients: {
      connect: {
        id: clientId,
      },
    },
  }))
  const manyGrantTypes = grantTypes.map((grantType) =>
    prisma.grant.create({
      data: grantType,
    }),
  )
  prisma.$transaction(manyGrantTypes)
}

export const connectDefaultUserScopes = async (
  prisma: PrismaClient,
  id: string,
) => {
  const scopes = prisma.application.update({
    where: {
      id,
    },
    data: {
      EnabledScopes: {
        connect: [
          {
            name: 'user',
          },
          {
            name: 'read:user',
          },
          {
            name: 'user:email',
          },
          {
            name: 'user:follow',
          },
        ],
      },
    },
  })
  prisma.$transaction([scopes])
}

export const createOrConnectRole = async (prisma: PrismaClient, id: string) => {
  prisma.user.update({
    where: {
      id,
    },
    data: {
      Groups: {
        connect: {
          name: 'default',
        },
      },
    },
  })
}

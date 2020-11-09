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
    prisma.oAuthGrant.create({
      data: grantType,
    }),
  )
  prisma.$transaction(manyGrantTypes)
}

export const createRolesAndConnect = async (
  prisma: PrismaClient,
  userPoolId: string,
) => {
  const userPoolRoles = [
    {
      name: 'USER',
      description: 'User role',
      Scopes: {
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
    {
      name: 'ORG_ADMIN',
      description:
        'Fully manage the organization and its group and memberships.',
      Scopes: {
        create: [
          {
            name: 'write:org',
            description:
              'Read and write access to organization membership, organization group and membership.',
          },
          {
            name: 'read:org',
            description:
              'Read-only access to organization membership, organization group and membership.',
          },
        ],
      },
    },
  ].map((grantType) => ({
    ...grantType,
    UserPool: {
      connect: {
        id: userPoolId,
      },
    },
  }))

  const manyRoles = userPoolRoles.map((role) =>
    prisma.role.create({
      data: role,
    }),
  )
  prisma.$transaction(manyRoles)
}

export const connectDefaultUserScopes = async (
  prisma: PrismaClient,
  id: string,
) => {
  const scopes = prisma.oAuthClient.update({
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

export const createOrConnectRole = async (
  prisma: PrismaClient,
  id: string,
  userPoolId: string,
) => {
  prisma.user.update({
    where: {
      id,
    },
    data: {
      Roles: {
        connectOrCreate: {
          where: {
            name_userPoolId: {
              name: 'Role',
              userPoolId,
            },
          },
          create: {
            name: 'USER',
            description: 'User role',
            UserPool: {
              connect: {
                id: userPoolId,
              },
            },
            Scopes: {
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
        },
      },
    },
  })
}

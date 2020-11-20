import moment from 'moment'
import { prisma } from '../../context'

const mapScopes = (scopes: Array<string>) => {
  return scopes.map((scope) => ({
    name: scope,
  }))
}

export const getClient = (clientId: string) => {
  return prisma.oAuthClient.findOne({
    where: {
      id: clientId,
    },
    include: {
      EnabledCustomScopes: {
        include: {
          ResourceServer: true,
        },
      },
      EnabledScopes: true,
    },
  })
}

export const getUserById = (userId: string) => {
  return prisma.user.findOne({
    where: {
      id: userId,
    },
  })
}

export const issueAccessToken = (
  clientId: string,
  userId: string,
  scopes: Array<string>,
  customScopes: Array<string>,
  accessTokenLifetime: number,
) => {
  return prisma.oAuthAccessToken.create({
    data: {
      accessToken: '',
      Client: {
        connect: {
          id: clientId,
        },
      },
      User: {
        connect: {
          id: userId,
        },
      },
      Scopes: {
        connect: mapScopes(scopes),
      },
      CustomScopes: {
        connect: mapScopes(customScopes),
      },
      expirationDate: moment()
        .add({
          minute: accessTokenLifetime,
        })
        .toISOString(),
    },
  })
}

export const issueRefreshToken = (
  clientId: string,
  userId: string,
  refreshTokenLifetime: number,
) => {
  return prisma.oAuthRefreshToken.create({
    data: {
      Client: {
        connect: {
          id: clientId,
        },
      },
      User: {
        connect: {
          id: userId,
        },
      },
      expirationDate: moment()
        .add({
          minute: refreshTokenLifetime,
        })
        .toISOString(),
    },
  })
}

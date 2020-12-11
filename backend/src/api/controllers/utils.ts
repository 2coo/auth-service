import {
  Application,
  Group,
  Registration,
  Role,
  Scope,
  User,
} from '@prisma/client'
import fs from 'fs'
import { flatMap, groupBy, sample, uniq, uniqBy } from 'lodash'
import moment from 'moment'
import { Moment } from 'moment-timezone'
import { JWK, JWS } from 'node-jose'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../../context'

type RoleWithApplication = Role & {
  Application: Application
}
type UserWithGroupsAndRegistrations = User & {
  Groups: (Group & {
    Roles: RoleWithApplication[]
  })[]
  Registrations: (Registration & {
    Application: Application
    Roles: Role[]
  })[]
}

const signToken = async (payload: object) => {
  const ks = fs.readFileSync(`${__dirname}/../../keys/jwks.json`)
  const keyStore = await JWK.asKeyStore(ks.toString())
  const jwks = keyStore.all({ use: 'sig' })
  const rawKey = sample(jwks)

  if (rawKey !== undefined) {
    const key = await JWK.asKey(rawKey)
    const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } }
    const token = await JWS.createSign(opt, key)
      .update(JSON.stringify(payload))
      .final()
    return token
  }
  throw new Error('RawKey is undefined!')
}

const mapScopes = (scopes: Array<string>) => {
  return scopes.map((scope) => ({
    name: scope,
  }))
}

export const getClient = (clientId: string) => {
  return prisma.application.findOne({
    where: {
      id: clientId,
    },
    include: {
      EnabledScopes: true,
    },
  })
}

export const getUserById = (userId: string) => {
  return prisma.user.findOne({
    where: {
      id: userId,
    },
    include: {
      Groups: {
        include: {
          Roles: {
            include: {
              Application: true,
            },
          },
        },
      },
      Registrations: {
        include: {
          Application: true,
          Roles: true,
        },
      },
      Profile: true,
    },
  })
}

export const generateAuthCode = (
  clientId: string,
  userId: string,
  redirectUri: string,
  scopes: Array<string>,
) => {
  return prisma.authorizationCode.create({
    data: {
      Application: {
        connect: {
          id: clientId,
        },
      },
      expirationDate: moment()
        .add({
          minute: 1,
        })
        .toISOString(),
      redirectURI: redirectUri,
      User: {
        connect: {
          id: userId,
        },
      },
      Scopes: {
        connect: mapScopes(scopes),
      },
    },
  })
}

export const getAuthCode = (code: string) => {
  return prisma.authorizationCode.findOne({
    where: {
      code: code,
    },
    include: {
      Scopes: true,
    },
  })
}

export const issueAccessToken = async (
  clientId: string,
  userId: string | null,
  scopes: Array<string>,
  accessTokenLifetime: number,
) => {
  const expirationDate = calculateExpirationDate(accessTokenLifetime)
  const jti = uuidv4()
  const application = await getClientById(clientId)

  if (userId) {
    const user = await getUserById(userId)
    if (user) {
      const token = await signToken({
        iss: application!.issuer,
        sub: userId,
        aud: clientId,

        applicationId: clientId,

        groups: user.Groups.map((group) => group.name),
        roles: getUserApplicationRoles(user, clientId),

        scopes: scopes,
        token_use: 'access',
        // nbf: NaN,
        iat: moment().valueOf() / 1000,
        exp: expirationDate.valueOf() / 1000,
        jti: jti,
        // claims
        username: user.username,
        email: user.email,
        displayName: user.Profile?.displayName,
      })
      await prisma.accessToken.create({
        data: {
          jti: jti,
          Application: {
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
          expirationDate: expirationDate.toISOString(),
        },
      })
      return token
    }
  } else {
    const token = await signToken({
      iss: application!.issuer,
      sub: clientId,
      aud: clientId,
      token_use: 'access',
      nbf: null,
      iat: moment().valueOf(),
      exp: expirationDate.valueOf() / 1000,
      jti: jti,
    })
    await prisma.accessToken.create({
      data: {
        jti: jti,
        Application: {
          connect: {
            id: clientId,
          },
        },
        Scopes: {
          connect: mapScopes(scopes),
        },
        expirationDate: expirationDate.toISOString(),
      },
    })
    return token
  }

  throw Error('User not found!')
}

export const issueRefreshToken = (
  clientId: string,
  userId: string,
  scopes: Array<string>,
  refreshTokenLifetime: number,
) => {
  return prisma.refreshToken.create({
    data: {
      Application: {
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
      expirationDate: moment()
        .add({
          minute: refreshTokenLifetime,
        })
        .toISOString(),
    },
  })
}

export const calculateExpiresInAsSecond = (
  expirationDate: string | Moment | Date,
) => {
  return moment.parseZone(expirationDate).diff(moment(), 'seconds')
}

export const calculateExpirationDate = (accessTokenLifetime: number) => {
  return moment().add({
    minute: accessTokenLifetime,
  })
}

export const isExpired = (expirationDate: string | Date): boolean => {
  return moment().isAfter(moment(expirationDate))
}

export const getClientById = (clientId: string) => {
  return prisma.application.findOne({
    where: {
      id: clientId,
    },
    include: {
      EnabledScopes: true,
      RedirectUris: true,
      SelfRegistrationFields: true,
    },
  })
}

export const getAccessToken = (jti: string) => {
  return prisma.accessToken.findOne({
    where: {
      jti,
    },
    include: {
      Application: true,
      Scopes: true,
    },
  })
}

export const getUserByUsernameOrEmail = (username: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          username: username,
        },
        {
          email: username,
        },
      ],
    },
    include: {
      Profile: true,
      Groups: {
        include: {
          Roles: true,
        },
      },
    },
  })
}
export const getUserRegistration = (userId: string, appId: string) => {
  return prisma.registration.findOne({
    where: {
      userId_applicationId: {
        userId: userId,
        applicationId: appId,
      },
    },
  })
}

export const deleteAuthCode = (id: string) => {
  return prisma.authorizationCode.delete({
    where: {
      id,
    },
  })
}

export const getRolesFromUser = (user: {
  Groups: Array<{
    Roles: Array<Role>
  }>
}) => {
  return uniq(
    flatMap(user.Groups, (group) =>
      group.Roles.map((role: Role) => ({
        ...role,
        permissions: role.permissions ? JSON.parse(role.permissions) : null,
      })),
    ),
  )
}

export const getScopesFromClient = (client: {
  EnabledScopes: Array<Scope>
}) => {
  return client.EnabledScopes.map((scope: Scope) => scope.name)
}

export const getRefreshToken = (refreshToken: string) => {
  return prisma.refreshToken.findOne({
    where: {
      refreshToken,
    },
    include: {
      Scopes: true,
    },
  })
}

export const getDefaultApplicationByTenant = (id: string) => {
  const defaultApp = prisma.application.findOne({
    where: {
      tenantId_name: {
        name: 'Default',
        tenantId: id,
      },
    },
    include: {
      EnabledScopes: true,
    },
  })
  return defaultApp
}

export const getUserApplicationRoles = (
  user: UserWithGroupsAndRegistrations,
  applicationId: string,
) => {
  /*
  Some or all of these Roles are managed by Group membership(s) to Academic head, Teacher.
  Removing assigned Roles here may not remove the Role
  from the User if the Role has been assigned by the Group membership.
  */
  const groupRoles = user.Groups.map((group) =>
    group.Roles.filter((role) => role.applicationId === applicationId),
  ).flat()
  const registrationRoles = user.Registrations.find(
    (registration) => registration.Application.id === applicationId,
  )!.Roles
  return uniq([...groupRoles, ...registrationRoles])
}

export const getUserRolesGroupedByApplication = (
  user: UserWithGroupsAndRegistrations,
) => {
  const groupRoles = user.Groups.map((group) => group.Roles).flat()
  const registrationRoles = user.Registrations.map((registration) =>
    registration.Roles.map(
      (role) =>
        ({
          ...role,
          Application: registration.Application,
        } as RoleWithApplication),
    ).flat(),
  )
  const userRoles = groupBy(
    uniqBy([...groupRoles, ...registrationRoles], 'id'),
    'applicationId',
  )
  return userRoles
}

export const consumeRememberMeToken = async (token: string) => {
  const user = (await prisma.rememberMe.findOne({
    where: {
      token,
    },
    include: {
      User: true,
    },
  }))!.User
  if (user) {
    await prisma.rememberMe.delete({
      where: {
        token: token,
      },
    })
  }
  return user
}

export const saveRememberMeToken = (token: string, userId: string) => {
  return prisma.rememberMe.create({
    data: {
      token,
      User: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

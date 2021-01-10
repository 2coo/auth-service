import { Payload } from './../../core/interfaces/Payload'
import {
  AccountStatusType,
  Application,
  Group,
  Registration,
  Role,
  Scope,
  User,
  Prisma,
  Tenant,
} from '@prisma/client'
import fs from 'fs'
import { flatMap, groupBy, sample, uniq, uniqBy, range } from 'lodash'
import moment from 'moment'
import { Moment } from 'moment-timezone'
import { JWK, JWS } from 'node-jose'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
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

const signToken = async (payload: Payload) => {
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

export const mapScopes = (scopes: Array<string>) => {
  return scopes.map((scope) => ({
    name: scope,
  }))
}

export const getClient = (clientId: string) => {
  return prisma.application.findUnique({
    where: {
      id: clientId,
    },
    include: {
      EnabledScopes: true,
    },
  })
}

export const getUserById = (userId: string) => {
  return prisma.user.findUnique({
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
  return prisma.authorizationCode.findUnique({
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
  const application: any = await getClientById(clientId, {
    EnabledScopes: true,
    RedirectUris: true,
    SelfRegistrationFields: true,
  })

  if (userId) {
    const user = await getUserById(userId)
    if (user) {
      const token = await signToken({
        iss: application!.issuer,
        sub: userId,
        aud: clientId,

        client_id: clientId,

        groups: user.Groups.map((group) => group.name),
        roles: getUserApplicationRoles(user, clientId).map((role) => role.name),

        scopes: scopes,
        token_use: 'access',
        // nbf: NaN,
        iat: moment().valueOf() / 1000,
        exp: expirationDate.valueOf() / 1000,
        jti: jti,
        // claims
        preferred_username: user.username,
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
      client_id: clientId,
      token_use: 'access',
      iat: moment().valueOf(),
      exp: expirationDate.valueOf() / 1000,
      jti: jti,
      scopes: application!.EnabledScopes!.map((scope: Scope) => scope.name),
      roles: [],
      groups: [],
      preferred_username: application!.name,
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

export const issueIdToken = async (
  clientId: string,
  userId: string,
  scopes: Array<string>,
  idTokenLifetime: number,
) => {
  const expirationDate = calculateExpirationDate(idTokenLifetime)
  const jti = uuidv4()
  const application = await getClientById(clientId)
  const user = await getUserById(userId)
  if (user) {
    const token = await signToken({
      iss: application!.issuer,
      sub: userId,
      aud: clientId,
      token_use: 'id',
      // nbf: NaN,
      iat: moment().valueOf() / 1000,
      exp: expirationDate.valueOf() / 1000,
      jti: jti,
      // claims
      ...(scopes.indexOf('email') > -1 && {
        email: user.email,
        email_verified: user.accountStatusType === AccountStatusType.CONFIRMED,
      }),
      ...(scopes.indexOf('profile') > -1 && {
        ...(user.Profile && {
          gender: user.Profile.gender,
          birthdate: moment.parseZone(user.Profile.birthdate).format(),
          family_name: user.Profile.lastName,
          given_name: user.Profile.firstName,
          picture: user.Profile!.picture,
          preferred_username: user.username,
          groups: user.Groups.map((group) => group.name),
        }),
      }),
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

export const getClientById = (
  clientId: string,
  include?: Prisma.ApplicationInclude,
) => {
  return prisma.application.findUnique({
    where: {
      id: clientId,
    },
    ...(include !== undefined
      ? {
          include,
        }
      : {}),
  })
}

export const getAccessToken = (jti: string) => {
  return prisma.accessToken.findUnique({
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
  return prisma.registration.findUnique({
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
  return prisma.refreshToken.findUnique({
    where: {
      refreshToken,
    },
    include: {
      Scopes: true,
    },
  })
}

export const getDefaultApplicationByTenant = (id: string) => {
  const defaultApp = prisma.application.findUnique({
    where: {
      tenantId_name: {
        name: 'Default',
        tenantId: id,
      },
    },
    include: {
      EnabledScopes: true,
      RedirectUris: true,
    },
  })
  return defaultApp
}

export const getUserRoles = (user: UserWithGroupsAndRegistrations) => {
  const groupRoles = user.Groups.map((group) => group.Roles).flat()
  const registrationRoles = user.Registrations.map((registration) =>
    registration.Roles.map(
      (role) =>
        ({
          ...role,
          Application: registration.Application,
        } as RoleWithApplication),
    ).flat(),
  ).flat()
  const userRoles = uniqBy([...groupRoles, ...registrationRoles], 'id')
  return userRoles
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
  const registrationRoles =
    user.Registrations.find(
      (registration) => registration.Application.id === applicationId,
    )?.Roles || []
  return uniqBy([...groupRoles, ...registrationRoles], 'applicationId')
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
  ).flat()
  const userRoles = groupBy(
    uniqBy([...groupRoles, ...registrationRoles], 'id'),
    'applicationId',
  )
  return userRoles
}

export const consumeRememberMeToken = async (token: string) => {
  const user = (await prisma.rememberMe.findUnique({
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

export const registerUser = async ({
  data,
  tenantId,
  applications,
}: {
  tenantId: string
  data: {
    email: string
    password: string
    fullname: string
  }
  applications: string[]
}) => {
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(data.password, salt)
  const fullNameSplitted = data.fullname.split(' ')
  const firstName = fullNameSplitted[0]
  const lastName = fullNameSplitted[fullNameSplitted.length - 1]
  const user = await prisma.user.create({
    data: {
      Tenant: {
        connect: {
          id: tenantId,
        },
      },
      salt: salt,
      email: data.email,
      password: hash,
      Profile: {
        create: {
          displayName: data.fullname,
          firstName,
          lastName,
        },
      },
    },
    include: {
      Profile: true,
      Groups: true,
    },
  })
  await applications.forEach(async (app_id) => {
    const defaultRole = await prisma.role.findFirst({
      where: {
        isDefault: true,
        applicationId: app_id,
      },
    })
    await prisma.registration.create({
      data: {
        User: {
          connect: {
            id: user.id,
          },
        },
        Application: {
          connect: {
            id: app_id,
          },
        },
        ...(defaultRole
          ? {
              Roles: {
                connect: {
                  id: defaultRole.id,
                },
              },
            }
          : {}),
      },
    })
  })
  return user
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

export const generateVerificationCode = (
  length: number = 4,
  user_id: string,
) => {
  const code = range(length)
    .map((i) => getRandomInt(9))
    .join('')
  const expDate = calculateExpirationDate(1440)
  return prisma.verificationCode.create({
    data: {
      User: {
        connect: {
          id: user_id,
        },
      },
      code: code,
      expirationDate: expDate.toISOString(),
    },
  })
}

export const verifyCode = async (code: string, user_id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  })
  if (user?.accountStatusType === AccountStatusType.CONFIRMED) return true
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      userId: user_id,
      code: code,
      expirationDate: {
        gt: moment().toISOString(),
      },
    },
  })
  const verificationCodeExists = Boolean(verificationCode)
  let verified = false
  if (verificationCodeExists) {
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        accountStatusType: AccountStatusType.CONFIRMED,
      },
    })
    verified = true
    await prisma.verificationCode.delete({
      where: {
        userId_code: {
          code,
          userId: user_id,
        },
      },
    })
  }
  return verified
}

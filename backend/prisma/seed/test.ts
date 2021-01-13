import { AccountStatusType, GrantType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export const seedTestData = (prisma: PrismaClient) => {
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync('test123', salt)
  const testUser = prisma.user.create({
    data: {
      Tenant: {
        connect: {
          domainName: '*',
        },
      },
      email: 'test@tomujin.digital',
      username: 'test',
      password: hash,
      salt: salt,
      accountStatusType: AccountStatusType.CONFIRMED,
      Profile: {
        create: {
          firstName: 'Brene',
          lastName: 'Brown',
          displayName: 'Brene Brown',
        },
      },
      Registrations: {
        create: {
          Application: {
            connect: {
              id: '71566877-ce96-4da8-94f5-330edd645b60',
            },
          },
          Roles: {
            connect: {
              name_applicationId: {
                name: 'everyone',
                applicationId: '71566877-ce96-4da8-94f5-330edd645b60',
              },
            },
          },
          username: 'test',
        },
      },
    },
  })
  const testApp = prisma.application.create({
    data: {
      id: '0d33a87d-1b95-409b-b628-148d44293674',
      secret: 'ckiobeqr40000ofdyl4cl2ydw',
      Tenant: {
        connect: {
          domainName: '*',
        },
      },
      Registrations: {
        create: [
          {
            User: {
              connect: {
                email: 'giva9712@gmail.com',
              },
            },
            username: 'giva',
          },
        ],
      },
      name: 'Tiny',
      RedirectUris: {
        create: [
          {
            url: 'http://localhost:3030/auth/example/callback',
          },
          {
            url: 'ai.tinyapp://login',
          },
          {
            url: 'ai.tinyapp://logout',
          },
        ],
      },
      EnabledScopes: {
        connect: [
          { name: 'openid' },
          { name: 'email' },
          { name: 'profile' },
          { name: 'user.admin' },
        ],
      },
      Grants: {
        connect: [
          {
            grantType: GrantType.AUTHORIZATION_CODE,
          },
          {
            grantType: GrantType.REFRESH_TOKEN,
          },
          {
            grantType: GrantType.CLIENT_CREDENTIALS,
          },
        ],
      },
    },
  })
  return [testUser, testApp]
}

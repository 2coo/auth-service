import { GrantType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { defaultRoles } from './roles'

export const seedTestData = (prisma: PrismaClient) => {
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync('123', salt)
  const testUser = prisma.user.create({
    data: {
      Tenant: {
        connect: {
          domainName: '*',
        },
      },
      email: 'test@test.com',
      username: 'test',
      password: hash,
      salt: salt,
      Profile: {
        create: {
          firstName: 'Test',
          lastName: 'Account',
          displayName: 'Test Account',
        },
      },
    },
  })
  const testApp = prisma.application.create({
    data: {
      Tenant: {
        connect: {
          domainName: '*',
        },
      },
      Registrations: {
        create: {
          User: {
            connect: {
              email: 'test@test.com',
            },
          },
          username: 'test',
        },
      },
      name: 'Test Application #1',
      RedirectUris: {
        create: {
          url: 'http://localhost:3000/auth/example/callback',
        },
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

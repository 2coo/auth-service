import { GrantType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
      id: "0d33a87d-1b95-409b-b628-148d44293674",
      secret: "ckiobeqr40000ofdyl4cl2ydw",
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

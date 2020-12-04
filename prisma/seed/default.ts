import { GrantType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { defaultRoles } from './roles'

export const seedDefaultTenantWithAdmin = (prisma: PrismaClient) => {
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt)
  const defaultSettings = prisma.tenant.create({
    data: {
      domainName: '*',
      Users: {
        create: {
          email: process.env.ADMIN_EMAIL,
          password: hash,
          salt: salt,
          username: 'admin',
          Profile: {
            create: {
              firstName: 'Admin',
              lastName: 'Super',
              displayName: 'Super Admin',
            },
          },
        },
      },
      Applications: {
        create: {
          name: 'Default AvigAuth',
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
              { name: 'avig.auth.user.admin' },
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
          Roles: {
            create: defaultRoles,
          },
          Registrations: {
            create: {
              User: {
                connect: {
                  email: process.env.ADMIN_EMAIL,
                },
              },
              Roles: {
                connect: {
                  name: 'admin',
                },
              },
              username: 'admin',
            },
          },
        },
      },
    },
  })
  return [defaultSettings]
}

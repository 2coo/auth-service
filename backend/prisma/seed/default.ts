import { GrantType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { defaultRoles } from './roles'

export const seedDefaultTenantWithAdmin = (prisma: PrismaClient) => {
  const adminEmail = String(process.env.ADMIN_EMAIL)
  const adminPassword = String(process.env.ADMIN_PASSWORD)
  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(adminPassword, salt)
  const defaultSettings = prisma.tenant.create({
    data: {
      domainName: '*',
      Users: {
        create: {
          email: adminEmail,
          password: hash,
          salt: salt,
          username: 'admin',
          Profile: {
            create: {
              firstName: 'Admin',
              lastName: 'Super',
              displayName: 'Admin',
            },
          },
        },
      },
      Applications: {
        create: {
          id: "71566877-ce96-4da8-94f5-330edd645b60",
          name: 'Default',
          trustedApplication: true,
          RedirectUris: {
            create: {
              url: '/oauth2/authorize',
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
          Roles: {
            create: defaultRoles,
          },
          Registrations: {
            create: {
              User: {
                connect: {
                  email: adminEmail,
                },
              },
              Roles: {
                connect: {
                  name_applicationId: {
                    name: 'admin',
                    applicationId: '71566877-ce96-4da8-94f5-330edd645b60',
                  },
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

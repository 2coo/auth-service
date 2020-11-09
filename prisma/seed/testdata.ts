import { Organization, PrismaClient } from '@prisma/client'

export const seedTestData = (prisma: PrismaClient) => {
  const testData = prisma.organization.create({
    data: {
      name: 'Tomujin',
      UserPools: {
        create: {
          identifier: 'tashuman',
          name: 'Tomujin & Human',
          Scopes: {
            connect: [
              { name: 'user' },
              { name: 'read:user' },
              { name: 'user:email' },
              { name: 'user:follow' },
            ],
          },
          Users: {
            create: {
              email: 'tuvshinbayar@tomujin.digital',
              username: 'Giva',
              password:
                '$2a$10$ygQy4NrE/dHeksMuToOJKOpsOfhU2QyVmNm0LQEa87EERUZIac49y',
            },
          },
          Roles: {
            create: {
              name: 'USER',
              Scopes: {
                connect: [
                  { name: 'user' },
                  { name: 'read:user' },
                  { name: 'user:email' },
                  { name: 'user:follow' },
                ],
              },
              Users: {
                connect: {
                  email_isExternalProvider: {
                    email: 'tuvshinbayar@tomujin.digital',
                    isExternalProvider: false,
                  },
                },
              },
            },
          },
          Clients: {
            create: {
              id: 'eb41edd4-75d9-47d3-a02c-46cbcf47f46f',
              name: 'TASS - Tomujin Alternative School Solution',
            },
          },
        },
      },
    },
  })
  return testData
}

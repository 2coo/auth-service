import { PrismaClient } from '@prisma/client'

export const seedTestData = (prisma: PrismaClient) => {
  const testUser = prisma.user.create({
    data: {
      email: 'tuvshinbayar@tomujin.digital',
      username: 'Giva',
      password: '$2y$10$PeKLgfT5usfxM3PVRrKQyedSb5aGKHRYDzov/hMiyFe4pwq9FL9L2',
      Groups: {
        connect: {
          name: 'default',
        },
      },
    },
  })
  const testClient = prisma.oAuthClient.create({
    data: {
      id: 'eb41edd4-75d9-47d3-a02c-46cbcf47f46f',
      name: 'TASS - Tomujin Alternative School Solution',
      RedirectUris: {
        create: {
          url: 'http://localhost:3000/auth/example/callback',
        },
      },
      EnabledScopes: {
        connect: [
          { name: 'user' },
          { name: 'read:user' },
          { name: 'user:email' },
          { name: 'user:follow' },
        ],
      },
    },
  })

  return [testUser, testClient]
}

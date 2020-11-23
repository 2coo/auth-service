import { PrismaClient } from '@prisma/client'

export const seedGroups = (prisma: PrismaClient) => {
  const defaultGroup = prisma.group.create({
    data: {
      name: 'default',
      Scopes: {
        connect: [
          { name: 'user' },
          { name: 'read:user' },
          { name: 'user:email' },
          { name: 'user:follow' },
        ],
      },
    },
  })

  return [defaultGroup]
}

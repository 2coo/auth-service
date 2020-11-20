import {
  PrismaClient,

  SystemRole
} from '@prisma/client'
import { hash } from 'bcryptjs'

export const seedSystemUser = async (prisma: PrismaClient) => {
  const password = 'admin123'
  const hashPassword = await hash(password, 10)
  const user = prisma.systemUser.create({
    data: {
      username: 'admin',
      email: 'tuvshinbayar@tomujin.digital',
      SystemRole: SystemRole.SUPER_ADMIN,
      password: hashPassword,
    },
  })
  return user
}

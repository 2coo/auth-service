import { PrismaClient, SystemUser, SystemRole } from '@prisma/client'
import { hash } from 'bcryptjs'

export const seedSystemUser = async (
  prisma: PrismaClient,
): Promise<SystemUser[]> => {
  const password = 'admin123'
  const saltRounds = 10
  const _password = await hash(password, saltRounds)
  const user = prisma.systemUser.create({
    data: {
      username: 'admin',
      email: 'tuvshinbayar@tomujin.digital',
      role: SystemRole.SUPER_ADMIN,
      password: _password,
    },
  })
  return prisma.$transaction([user])
}

import { prisma } from '../context'
import moment from 'moment-timezone'

export const validateTokenExpiration = async (
  access_token: string,
  userPoolIdentifier: string,
) => {
  const now = moment()
  const accessToken = await prisma.oAuthAccessToken.findOne({
    where: {
      accessToken: access_token,
    },
    include: {
      Client: {
        include: {
          UserPool: true,
        },
      },
    },
  })
  if (!accessToken) throw new Error('invalid_token')
  const expirationDate = moment.parseZone(accessToken.expirationDate)
  if (accessToken.Client.UserPool.identifier !== userPoolIdentifier)
    throw new Error('UserPool not matched!')
  if (now.isAfter(expirationDate)) throw new Error('Token has been expired!')
  return accessToken
}

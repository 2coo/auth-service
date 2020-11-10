import { prisma } from '../context'
import moment from 'moment-timezone'

export const validateAccessTokenExpiration = async (
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

export const validateAuthCodeExpiration = async (
  auth_code: string,
  userPoolIdentifier: string,
) => {
  const now = moment()
  const authCode = await prisma.oAuthAuthorizationCode.findOne({
    where: {
      code: auth_code,
    },
    include: {
      Client: {
        include: {
          UserPool: true,
        },
      },
    },
  })
  if (!authCode) throw new Error('invalid_token')
  const expirationDate = moment.parseZone(authCode.expirationDate)
  if (authCode.Client.UserPool.identifier !== userPoolIdentifier)
    throw new Error('UserPool not matched!')
  if (now.isAfter(expirationDate)) throw new Error('Token has been expired!')
  return authCode
}

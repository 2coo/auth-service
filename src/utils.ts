import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { verify } from 'jsonwebtoken'

// export interface Token {
//   email: string
// }

// export function getUserEmail(context: ExpressContext): Token {
//   const Authorization = context.req.get('Authorization')
//   if (APP_SECRET == Authorization) {
//     return { email: 'admin' }
//   }
//   if (Authorization) {
//     const token = Authorization.replace('Bearer ', '')
//     const verifiedToken = verify(token, APP_SECRET) as Token
//     return verifiedToken && { email: verifiedToken.email }
//   }
//   return { email: '' }
// }

export interface Token {
  userId: string | null
}

export function getUserId(context: ExpressContext): Token {
  const Authorization = context.req.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(
      token,
      process.env.APP_SECRET as string,
    ) as Token
    return verifiedToken
  }
  return { userId: null }
}

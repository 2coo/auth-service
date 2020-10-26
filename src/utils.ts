import { ContextParameters } from 'graphql-yoga/dist/types'
import { verify } from 'jsonwebtoken'

export const APP_SECRET = 'appsecret321'

export interface Token {
  email: string
}

export function getUserEmail(context: ContextParameters) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    return verifiedToken && verifiedToken.email
  }
}
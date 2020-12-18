import { AccessTokenClaims } from './AccessToken'
import { OpenIDStandardClaims } from './OpenID'

export type Payload = {
  sub: string
  aud: string
  iss: string
  auth_time?: number
  exp: number
  iat: number
  jti?: string
  nbf?: number
} & (
  | ({
      token_use: 'id'
    } & OpenIDStandardClaims)
  | ({
      token_use: 'access'
    } & AccessTokenClaims)
)

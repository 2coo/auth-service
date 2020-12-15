type UserParams = {
  sub: string | number
  email?: string
  username?: string
  displayName?: string
  scopes: string | Array<string>
  groups?: string | Array<string>
  roles?: string | Array<string>
  [key: string]: any
} & {
  iss?: never
  aud?: never
  exp?: never
  token_use?: never
  iat?: never
  jti?: never
}

interface UserInterface {
  sub: string | number
  scopes: string | Array<string>
  canScope: (args0: string) => boolean
}

export class AppUser implements UserInterface {
  sub
  email
  username
  displayName
  scopes
  groups
  roles
  constructor(payload: UserParams) {
    this.sub = payload.sub
    this.email = payload.email
    this.username = payload.username
    this.displayName = payload.displayName
    this.scopes = payload.scopes
    this.groups = payload.groups
    this.roles = payload.roles
  }
  canScope = (scope: string): boolean => {
    return this.scopes.indexOf(scope) > -1
  }
  getGroups = (): Array<string> | string | undefined => {
    return this.groups
  }
}

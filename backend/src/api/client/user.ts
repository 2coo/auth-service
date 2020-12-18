import { Payload } from '../../core/interfaces/Payload'

export class AppUser {
  payload: Payload
  constructor(payload: Payload) {
    this.payload = payload
  }
  canScope = (scope: string): boolean => {
    if (this.payload.token_use === 'access')
      return this.payload.scopes.indexOf(scope) > -1
    return false
  }
  getGroups = (): Array<string> => {
    return this.payload.groups ?? []
  }
  getRoles = (): Array<string> | undefined => {
    if (this.payload.token_use === 'access') return this.payload.roles
  }
}

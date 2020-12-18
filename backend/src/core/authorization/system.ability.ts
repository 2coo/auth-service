// tslint:disable: no-any
import { Ability, InferSubjects } from '@casl/ability'
import { Request } from 'express'
import jwksClient from 'jwks-rsa'
import { isEqual, uniqWith } from 'lodash'
import { getUserById, getUserRoles } from '../../api/controllers/utils'
import interpolate from '../helpers/interpolate'
import { verifyJWT } from './../../api/client/index'
import { createAbility } from './common/casl-helpers'

// Modify these as per your needs
type Action = 'manage' | 'create' | 'read' | 'update' | 'delete'
type Subject = 'Test' | 'all'

// Do not touch
export type SystemAbilityAction = Action
export type SystemAbilitySubject = InferSubjects<Subject, true> | 'all'
export type SystemAbility = Ability<[SystemAbilityAction, SystemAbilitySubject]>

export async function defineSystemAbilitiesFor(
  req: Request & {
    session: {
      [any: string]: any
    }
  },
) {
  const host = req.protocol + '://' + req.get('host')
  const jwks_client = jwksClient({
    cache: true,
    rateLimit: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 10000,
    jwksUri: `${host}/.well-known/jwks.json`,
  })
  let accessToken = req.cookies.access_token
  if (!accessToken && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ')
    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]
      if (/^Bearer$/i.test(scheme)) {
        accessToken = credentials
      }
    }
  }
  if (!accessToken) {
    return createAbility<SystemAbilityAction, SystemAbilitySubject>([])
  }
  const payload = await verifyJWT(jwks_client, accessToken)
  console.log(payload)
  const user = await getUserById(payload.sub)
  if (!user) {
    return createAbility<SystemAbilityAction, SystemAbilitySubject>([])
  }
  const roles = getUserRoles(user)
  const permissions = uniqWith(
    roles
      .filter((role) => role.permissions !== null)
      .map((role) => interpolate(role.permissions, { user }))
      .flat(),
    isEqual,
  )
  return createAbility<SystemAbilityAction, SystemAbilitySubject>(permissions)
}

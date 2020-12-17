// tslint:disable: no-any
import { Ability, AbilityBuilder, InferSubjects } from '@casl/ability'
import { Application, Scope } from '@prisma/client'
import { Request } from 'express'
import jwksClient from 'jwks-rsa'
import { isEqual, uniqWith } from 'lodash'
import {
  getUserApplicationRoles,
  getUserById,
} from '../../api/controllers/utils'
import { verifyJWT } from './../../api/client/index'
import { createAbility } from './common/casl-helpers'

// Modify these as per your needs
type Action = 'manage' | 'create' | 'read' | 'update' | 'delete'
type Subject = 'User' | 'all'

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
  const defaultApp: Application & {
    EnabledScopes: Scope[]
  } = req.session.defaultApp

  const jwks_client = jwksClient({
    cache: true,
    rateLimit: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 10000,
    jwksUri: `${host}/.well-known/jwks.json`,
  })

  let accessToken = req.signedCookies.access_token
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
  const user = await getUserById(payload.sub)
  if (!user) {
    return createAbility<SystemAbilityAction, SystemAbilitySubject>([])
  }
  const roles = getUserApplicationRoles(user, defaultApp.id)
  const permissions = uniqWith(
    roles.map((role) => role.permissions),
    isEqual,
  )

  return createAbility<SystemAbilityAction, SystemAbilitySubject>([])
}

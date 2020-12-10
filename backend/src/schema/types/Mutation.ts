import { mutationType, stringArg } from '@nexus/schema'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export const Mutation = mutationType({
  definition(t) {},
})

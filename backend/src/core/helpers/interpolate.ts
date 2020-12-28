import { Prisma } from '@prisma/client'
import { get } from 'lodash'

export default (template: Prisma.JsonValue, vars: object) => {
  return JSON.parse(JSON.stringify(template), (_, rawValue) => {
    if (rawValue[0] !== '$') {
      return rawValue
    }
    const name = rawValue.slice(2, -1)
    const value = get(vars, name)
    if (typeof value === 'undefined') {
      throw new ReferenceError(`Variable ${name} is not defined`)
    }
    return value
  })
}

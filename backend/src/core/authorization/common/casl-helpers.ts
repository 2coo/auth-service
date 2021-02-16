import {
  Ability,
  ClaimRawRule,
  SubjectRawRule,
  SubjectType,
  ForbiddenError,
} from '@casl/ability'

ForbiddenError.setDefaultMessage('Unauthorized!')

export function createAbility<A extends string, S extends string | object>(
  rules: (
    | ClaimRawRule<string>
    | SubjectRawRule<string, SubjectType, unknown>
  )[],
) {
  return new Ability<[A, S]>(rules as any)
}

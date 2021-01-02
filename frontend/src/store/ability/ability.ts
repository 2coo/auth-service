import { AbilityBuilder, Ability, AbilityClass } from "@casl/ability";

export const AppAbility = Ability as AbilityClass<Ability<[any, any]>>;

export default function defineRulesFor() {
  const { can, rules } = new AbilityBuilder(AppAbility);
  return rules;
}

export function buildAbilityFor(): Ability<[any, any]> {
  return new AppAbility(defineRulesFor(), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    detectSubjectType: (object) => object!.type,
  });
}

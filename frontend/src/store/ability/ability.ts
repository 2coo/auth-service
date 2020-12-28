import { AbilityBuilder, Ability, AbilityClass } from "@casl/ability";

export type AppAbility = Ability<[any, any]>;

export const AppAbility = Ability as AbilityClass<AppAbility>;

export default function defineRulesFor() {
  const { can, rules } = new AbilityBuilder(AppAbility);
  return rules;
}

export function buildAbilityFor(): AppAbility {
  return new AppAbility(defineRulesFor(), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    detectSubjectType: (object) => object!.type,
  });
}

import { createContext } from "react";
import { createContextualCan, useAbility as useContextHook } from "@casl/react";
import { buildAbilityFor } from "./ability";

const ability = buildAbilityFor();

const AbilityContext = createContext<any>(null);
const Can = createContextualCan(AbilityContext.Consumer);

const useAbility = () => useContextHook(AbilityContext);

const AbilityProvider = ({ children }: any) =>
    <AbilityContext.Provider value={ability}>
        {children}
    </AbilityContext.Provider >

export { AbilityProvider, useAbility, Can, AbilityContext };

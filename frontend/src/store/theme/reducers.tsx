import { Theme } from "./context";

type Action = { type: "SET_LIGHT_THEME"; value: boolean };

export const themeReducer = (state: Theme, action: Action) => {
    switch (action.type) {
        case "SET_LIGHT_THEME":
            return {
                ...state,
                isLightTheme: action.value
            };

        default:
            throw new Error();
    }
};

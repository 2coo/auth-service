import { Auth } from "../../models/Auth";

export type Action = { type: "ADD_AUTH"; payload: Auth } | { type: 'REMOVE_AUTH' };

export const authReducer = (state: Auth, action: Action) => {
    switch (action.type) {
        case "ADD_AUTH":
            return {
                ...action.payload
            };
        case "REMOVE_AUTH": return {
            authenticated: false,
            user: null
        }
        default:
            throw new Error();
    }
};

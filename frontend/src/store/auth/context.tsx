import { Auth } from "../../models/Auth";
import { createContext, useReducer, useContext, Dispatch } from "react";
import { Action, authReducer } from "./reducers";

const initialState: Auth = {
    authenticated: false,
    user: null
}

const AuthContext = createContext<{
    state: Auth,
    dispatch: Dispatch<Action>
}>({
    state: initialState,
    dispatch: () => { }
});

const AuthProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(authReducer, initialState)
    return (<AuthContext.Provider value={{ state, dispatch }}>
        {children}
    </AuthContext.Provider>)
};

const AuthConsumer = AuthContext.Consumer

const useAuthContext = () => useContext(AuthContext);

export {
    AuthContext, AuthProvider, useAuthContext, AuthConsumer
}

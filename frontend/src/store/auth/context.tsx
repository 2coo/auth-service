import { Auth } from "../../models/Auth";
import { createContext, useReducer, useContext, Dispatch, useEffect } from "react";
import { Action, authReducer } from "./reducers";

const initialState: Auth = {
    authenticated: true,
    user: null
}

const localState = JSON.parse(String(localStorage.getItem("authode-auth")))

const AuthContext = createContext<{
    state: Auth,
    dispatch: Dispatch<Action>
}>({
    state: initialState,
    dispatch: () => { }
});

const AuthProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(authReducer, localState || initialState)
    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(state))
    }, [state])
    return (<AuthContext.Provider value={{ state, dispatch }}>
        {children}
    </AuthContext.Provider>)
};

const AuthConsumer = AuthContext.Consumer

const useAuthContext = () => useContext(AuthContext);

export {
    AuthContext, AuthProvider, useAuthContext, AuthConsumer
}

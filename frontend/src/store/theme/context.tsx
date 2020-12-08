import { createContext, useReducer, useContext, Dispatch } from "react";
import { themeReducer } from "./reducers";

export type Theme = {
  isLightTheme: boolean,
}

const initialState: Theme = {
  isLightTheme: true
}

const ThemeContext = createContext<{
  state: Theme,
  dispatch: Dispatch<any>
}>({
  state: initialState,
  dispatch: () => { }
});

const ThemeProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(themeReducer, initialState)
  return (<ThemeContext.Provider value={{ state, dispatch }}>
    {children}
  </ThemeContext.Provider>)
};
const useThemeContext = () => useContext(ThemeContext);

export {
  ThemeContext, ThemeProvider, useThemeContext
}

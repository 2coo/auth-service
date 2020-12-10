import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import theme from "./theme"
import { ThemeProvider } from '@material-ui/core/styles'
import { Router, globalHistory } from '@reach/router';
import { QueryParamProvider } from 'use-query-params';
import composeRoutes from './utils/route-composer';
import routes from "./routes"
import { AuthProvider } from './store/auth/context';
import { ThemeProvider as UserControllableThemeProvider } from './store/theme/context';

ReactDOM.render(
  <StrictMode>
    <AuthProvider>
      <UserControllableThemeProvider>
        <ThemeProvider theme={theme}>
          <QueryParamProvider reachHistory={globalHistory}>
            <Router>
              {composeRoutes(routes)}
            </Router>
          </QueryParamProvider>
        </ThemeProvider>
      </UserControllableThemeProvider>
    </AuthProvider>
  </StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

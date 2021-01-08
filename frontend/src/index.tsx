import { Router } from '@reach/router';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import "./App.less";
import ProviderWrapper from "./components/provider-wrapper/ProviderWrapper";
import "./i18n";
import './index.css';
import reportWebVitals from './reportWebVitals';
import routes from "./routes";
import composeRoutes from './utils/route-composer';

ReactDOM.render(
  <StrictMode>
    <Suspense fallback={<div>Loading ……</div>}>
      <ProviderWrapper>
        <Router>
          {composeRoutes(routes)}
        </Router>
      </ProviderWrapper>
    </Suspense>
  </StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

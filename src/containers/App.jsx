import React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import UnauthorizedPage from 'components/UnauthorizedPage';
import ProtectedRoutes from './ProtectedRoutes';

const AppContainer = () => (
  <React.StrictMode>
    <Router>
      <React.Fragment>
        <Switch>
          <Route
            component={UnauthorizedPage}
            exact
            path="/unauthorized"
          />
          <Route
            component={ProtectedRoutes}
            path="/"
          />
        </Switch>
      </React.Fragment>
    </Router>
  </React.StrictMode>
);

export default hot(module)(AppContainer);

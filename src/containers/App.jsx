import React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import UnauthorizedPage from '../components/UnauthorizedPage';
import ProtectedRoutes from './ProtectedRoutes';

const AppContainer = () => (
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
);

export default hot(module)(AppContainer);

import React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import UnauthorizedPage from '../components/UnauthorizedPage';
import ProtectedRoutes from './ProtectedRoutes';
// import App from '../components/App';

const AppContainer = () => (
  <Router>
    <React.Fragment>
      <Switch>
        <Route
          component={UnauthorizedPage}
          // component={App}
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

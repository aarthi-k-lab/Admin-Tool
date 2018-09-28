import React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import UnauthorizedPage from 'components/UnauthorizedPage';
import theme from 'lib/Theme';
import ProtectedRoutes from './ProtectedRoutes';

const AppContainer = () => (
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
  </React.StrictMode>
);

export default hot(module)(AppContainer);

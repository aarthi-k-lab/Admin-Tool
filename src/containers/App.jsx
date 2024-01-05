import React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'lib/Theme';
import ProtectedRoutes from './ProtectedRoutes';

const AppContainer = () => (
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route
            component={ProtectedRoutes}
            path="/"
          />
        </Switch>
      </Router>
    </MuiThemeProvider>
  </React.StrictMode>
);

export default hot(module)(AppContainer);

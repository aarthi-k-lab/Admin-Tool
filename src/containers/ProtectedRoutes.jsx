import React from 'react';
import PropTypes from 'prop-types';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import Auth from 'lib/Auth';
import SignInLoader from 'components/SignInLoader';
import ManagerDashboard from 'containers/ManagerDashboard';
import Dashboard from './Dashboard';

class ProtectedRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirectPath: null,
    };
    this.shouldRedirect = false;
    this.auth = null;
  }

  componentDidMount() {
    const { location } = this.props;
    Auth.login(location.pathname)
      .then((auth) => {
        this.auth = auth;
        if (auth.sessionValid) {
          this.setState({ loading: false });
          if (auth.groups && auth.groups.length > 0) {
            const redirectPath = Auth.getGroupHomePage(auth.groups);
            this.shouldRedirect = location.pathname === '/' && redirectPath !== location.pathname;
            this.setState({
              loading: false,
              redirectPath,
            });
          }
        }
      });
  }

  render() {
    const { loading, redirectPath } = this.state;
    if (loading) {
      return <SignInLoader />;
    }
    if (this.shouldRedirect) {
      this.shouldRedirect = false;
      return <Redirect to={redirectPath} />;
    }
    return (
      <Switch>
        <Route component={ManagerDashboard} exact path="/reports" />
        <Route component={Dashboard} />
      </Switch>
    );
  }
}

ProtectedRoutes.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default ProtectedRoutes;

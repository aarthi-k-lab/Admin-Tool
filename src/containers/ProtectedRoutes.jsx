import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Auth from '../lib/Auth';
import SignInLoader from '../components/SignInLoader';
import Dashboard from './Dashboard';

class ProtectedRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.auth = null;
  }

  componentDidMount() {
    const { location } = this.props;
    Auth.login(location.pathname)
      .then((auth) => {
        this.auth = auth;
        if (auth.sessionValid) {
          this.setState({ loading: false });
        }
      });
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return <SignInLoader />;
    }
    return (
      <Switch>
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

/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../lib/Auth';
import Center from '../components/Center';
import SignInLoader from '../components/SignInLoader';
import App from '../components/App';
import SSODemo from 'containers/SSODemo';
import { Route } from 'react-router-dom';

class ProtectedRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.auth = null;
  }

  componentDidMount() {
    Auth.login(this.props.location.pathname)
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
      <App>
        <Center>
          <Route component={SSODemo} />
        </Center>
      </App>
    );
  }
}

ProtectedRoutes.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

export default ProtectedRoutes;

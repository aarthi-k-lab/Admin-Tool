/* eslint-disable */
import React from 'react';
import Auth from '../lib/Auth';
import Center from '../components/Center';
import SignInLoader from '../components/SignInLoader';
import App from '../components/App';

class ProtectedRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.auth = null;
  }

  componentDidMount() {
    Auth.login()
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
    const userDetails = this.auth.getUserDetails();
    return (
      <App>
        <Center>
          {userDetails.name}
          <br />
          {userDetails.email}
          <br />
          {userDetails.jobTitle}
          <br />
          {JSON.stringify(this.auth.getGroups())}
        </Center>
      </App>
    );
  }
}

export default ProtectedRoutes;

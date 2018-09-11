/* eslint-disable */
import React from 'react';
import Button from '@material-ui/core/Button';
import Auth from '../lib/Auth';
import Center from '../components/Center';
import SignInLoader from '../components/SignInLoader';
import App from '../components/App';
import { FRONTEND_UNDERWRITER, BACKEND_UNDERWRITER, ADMIN } from '../lib/Groups';

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

  renderAdminButton() {
    if (this.auth.hasGroup(ADMIN)) {
      return <Button variant="contained">Admin</Button>;
    }
    return null;
  }

  renderFeuwButton() {
    if (this.auth.hasGroup(FRONTEND_UNDERWRITER)) {
      return <Button variant="contained">FEUW</Button>;
    }
    return null;
  }

  renderBeuwButton() {
    if (this.auth.hasGroup(BACKEND_UNDERWRITER)) {
      return <Button variant="contained">Beuw</Button>;
    }
    return null;
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
          <section>
            {userDetails.name}
            <br />
            {userDetails.email}
            <br />
            {userDetails.jobTitle}
            <br />
            {JSON.stringify(this.auth.getGroups())}
            <br />
            {this.renderAdminButton()}
            <br />
            {this.renderFeuwButton()}
            <br />
            {this.renderBeuwButton()}
          </section>
        </Center>
      </App>
    );
  }
}

export default ProtectedRoutes;

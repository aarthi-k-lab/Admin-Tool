/* eslint-disable */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Auth from '../lib/Auth';
import AppContainer from '../components/AppContainer';
import Body from '../components/Body';
import AppLayout from '../components/AppLayout';
import Center from '../components/Center';
import SignInLoader from '../components/SignInLoader';

class ProtectedRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    Auth.login()
      .then((auth) => {
        if (auth.sessionValid) {
          this.setState({ loading: false });
        }
      });
  }

  componentDidMount() {
    // setTimeout(() => this.setState({ loading: false }), 3000);
  }

  render() {
    return (
      <SignInLoader />
    );
    // const { loading } = this.state;
    // if (loading) {
    //   return (
    //     <AppContainer>
    //       <Center>
    //         <CircularProgress size={50} />
    //       </Center>
    //     </AppContainer>
    //   );
    // }
    // return (
    //   <AppLayout>
    //     <Center>
    //       asdhfjksldfjkas
    //     </Center>
    //   </AppLayout>
    // );
  }
}

export default ProtectedRoutes;

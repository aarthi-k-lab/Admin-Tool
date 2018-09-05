import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppContainer from '../AppContainer';
import Body from '../Body';
import Center from '../Center';

const SignInLoader = () => (
  <AppContainer>
    <Body>
      <Center>
        <div>
          <CircularProgress size={50} />
          <br />
          Signing In...
        </div>
      </Center>
    </Body>
  </AppContainer>
);

export default SignInLoader;

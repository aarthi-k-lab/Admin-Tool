import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppCenterDisplay from '../AppCenterDisplay';

import './SignInLoader.css';

const SignInLoader = () => (
  <AppCenterDisplay>
    <CircularProgress size={50} />
    <br />
    Signing In...
  </AppCenterDisplay>
);

export default SignInLoader;

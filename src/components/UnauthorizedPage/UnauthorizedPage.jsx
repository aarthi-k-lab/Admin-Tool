import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import AppCenterDisplay from '../AppCenterDisplay';

import './UnauthorizedPage.css';

const UnauthorizedPage = () => (
  <AppCenterDisplay>
    <ErrorIcon styleName="error-icon" />
  </AppCenterDisplay>
);

export default UnauthorizedPage;

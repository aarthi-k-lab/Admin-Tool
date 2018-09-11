import React from 'react';
import PropTypes from 'prop-types';
import ErrorIcon from '@material-ui/icons/Error';
import AppCenterDisplay from '../AppCenterDisplay';
import UnauthorizedAppHeader from '../UnauthorizedAppHeader';
import './UnauthorizedPage.css';
import Auth from '../../lib/Auth';

const UnauthorizedPage = ({ location }) => {
  const message = Auth.getErrorMessage(location);
  return (
    <AppCenterDisplay header={<UnauthorizedAppHeader />}>
      <div styleName="column">
        <ErrorIcon styleName="error-icon" />
        <span styleName="message">
          <span>
            {message.text}
          </span>
          <br />
          <span>
            {message.code}
          </span>
        </span>
      </div>
    </AppCenterDisplay>
  );
};

UnauthorizedPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default UnauthorizedPage;

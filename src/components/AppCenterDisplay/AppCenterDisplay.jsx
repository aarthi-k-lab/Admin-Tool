import React from 'react';
import PropTypes from 'prop-types';
import AppContainer from 'components/AppContainer';
import Body from 'components/Body';
import Center from 'components/Center';

import './AppCenterDisplay.css';

const AppCenterDisplay = ({ header, children }) => (
  <AppContainer>
    { header }
    <Body>
      <Center>
        <div styleName="app-center-display">
          {children}
        </div>
      </Center>
    </Body>
  </AppContainer>
);

AppCenterDisplay.defaultProps = {
  header: null,
};

AppCenterDisplay.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
};

export default AppCenterDisplay;

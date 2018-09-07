import React from 'react';
import PropTypes from 'prop-types';
import AppContainer from '../AppContainer';
import Body from '../Body';
import Center from '../Center';

import './AppCenterDisplay.css';

const AppCenterDisplay = ({ children }) => (
  <AppContainer>
    <Body>
      <Center>
        <div styleName="app-center-display">
          {children}
        </div>
      </Center>
    </Body>
  </AppContainer>
);

AppCenterDisplay.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppCenterDisplay;

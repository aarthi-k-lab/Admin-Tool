import React from 'react';
import PropTypes from 'prop-types';

import './AppContainer.css';

const AppContainer = ({ children }) => (
  <div styleName="app">
    { children }
  </div>
);

AppContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContainer;

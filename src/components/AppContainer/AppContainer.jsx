import React from 'react';
import PropTypes from 'prop-types';

import './AppContainer.css';
import Footer from 'components/Footer';

const AppContainer = ({ children, hideFooter }) => (
  <div styleName="app">
    { children }
    { hideFooter ? null : <Footer /> }
  </div>
);

AppContainer.defaultProps = {
  hideFooter: false,
};

AppContainer.propTypes = {
  children: PropTypes.node.isRequired,
  hideFooter: PropTypes.bool,
};

export default AppContainer;

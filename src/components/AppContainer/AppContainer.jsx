import React from 'react';
import PropTypes from 'prop-types';

import './AppContainer.css';
import Footer from '../Footer';

const AppContainer = ({ children }) => (
  <div styleName="app">
    { children }
    <Footer />
  </div>
);

AppContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContainer;

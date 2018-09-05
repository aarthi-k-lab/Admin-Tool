import React from 'react';
import PropTypes from 'prop-types';

import './Center.css';

const Center = ({ children }) => (
  <div styleName="center">
    { children }
  </div>
);

Center.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Center;

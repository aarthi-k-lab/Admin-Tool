import React from 'react';
import PropTypes from 'prop-types';

import './Center.css';

const Center = ({ children, disableExpand }) => (
  <div styleName={Center.getStyles(disableExpand)}>
    { children }
  </div>
);

Center.getStyles = (disableExpand) => {
  if (disableExpand) {
    return 'center--no-expand';
  }
  return 'center--expand';
};

Center.defaultProps = {
  disableExpand: false,
};

Center.propTypes = {
  children: PropTypes.node.isRequired,
  disableExpand: PropTypes.bool,
};

export default Center;

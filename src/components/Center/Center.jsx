import React from 'react';
import PropTypes from 'prop-types';

import './Center.css';

const Center = ({ children, className, disableExpand }) => (
  <div className={className} styleName={Center.getStyles(disableExpand)}>
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
  className: '',
  disableExpand: false,
};

Center.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disableExpand: PropTypes.bool,
};

export default Center;

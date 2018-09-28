import React from 'react';
import PropTypes from 'prop-types';

import './FullHeightColumn.css';

const FullHeightColumn = ({ children, className }) => (
  <div styleName="stretch-column">
    <section className={className} styleName="stretch-row">
      { children }
    </section>
  </div>
);

FullHeightColumn.defaultProps = {
  className: '',
};

FullHeightColumn.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default FullHeightColumn;

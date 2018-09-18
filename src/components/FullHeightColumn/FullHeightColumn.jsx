import React from 'react';
import PropTypes from 'prop-types';

import './FullHeightColumn.css';

const FullHeightColumn = ({ children }) => (
  <div styleName="stretch-column">
    <section styleName="stretch-row">
      { children }
    </section>
  </div>
);

FullHeightColumn.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FullHeightColumn;

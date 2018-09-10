import React from 'react';
import PropTypes from 'prop-types';

import './FullHeightColumn.css';
// import App from '../App';

const FullHeightColumn = ({ children }) => (
  // <App>
  <div styleName="stretch-column">
    <section styleName="stretch-row">
      { children }
    </section>
  </div>
  // </App>
);

FullHeightColumn.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FullHeightColumn;

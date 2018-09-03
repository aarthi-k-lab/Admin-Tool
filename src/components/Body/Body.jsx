import React from 'react';
import PropTypes from 'prop-types';

import './Body.css';

const Body = ({ children }) => (
  <div styleName="body-container">
    <section styleName="body">
      { children }
    </section>
  </div>
);

Body.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Body;

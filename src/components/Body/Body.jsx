import React from 'react';
import PropTypes from 'prop-types';

import './Body.css';

const Body = ({ children }) => (
  <section styleName="body">
    { children }
  </section>
);

Body.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Body;

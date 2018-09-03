import React from 'react';
import PropTypes from 'prop-types';

import './MainContent.css';

const MainContent = ({ children }) => (
  <article styleName="main-content">
    { children }
  </article>
);

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainContent;

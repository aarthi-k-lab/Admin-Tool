import React from 'react';
import PropTypes from 'prop-types';

import './MainContent.css';

const MainContent = ({ children, expandView }) => (
  <article styleName={expandView ? 'main-content-expanded' : 'main-content'}>
    { children }
  </article>
);

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
  expandView: PropTypes.bool.isRequired,
};

export default MainContent;

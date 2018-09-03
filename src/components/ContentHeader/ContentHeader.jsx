import React from 'react';
import PropTypes from 'prop-types';

import './ContentHeader.css';

const ContentHeader = ({ title }) => (
  <header styleName="content-header">
    <h3 styleName="title">{title}</h3>
    <span styleName="spacer" />
  </header>
);

ContentHeader.defaultProps = {
  title: 'Document Verification',
};

ContentHeader.propTypes = {
  title: PropTypes.string,
};

export default ContentHeader;

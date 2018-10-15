import React from 'react';
import PropTypes from 'prop-types';
import './ContentHeader.css';

const ContentHeader = ({
  title,
  children,
}) => (
  <header styleName="content-header">
    <h3 styleName="title">{title}</h3>
    <span styleName="spacer" />
    {children}
  </header>
);

ContentHeader.defaultProps = {
  children: null,
  title: 'FE Underwriter',
};

ContentHeader.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default ContentHeader;

import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './ContentHeader.css';

const ContentHeader = ({
  title,
  children,
  checklistTemplateName,
}) => (
  <header styleName="content-header">
    <Tooltip
      classes={{
        tooltip: styles.tooltip,
      }}
      placement="right"
      styleName="tooltip"
      title={checklistTemplateName}
    >
      <h3 styleName="title">{title}</h3>
    </Tooltip>
    <span styleName="spacer" />
    {children}
  </header>
);

ContentHeader.defaultProps = {
  children: null,
  title: 'FE Underwriter',
  checklistTemplateName: '',
};

ContentHeader.propTypes = {
  checklistTemplateName: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.node,
};

export default ContentHeader;

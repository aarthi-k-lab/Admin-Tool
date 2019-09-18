import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import styles from './ContentHeader.css';

const ContentHeader = ({
  title,
  children,
  checklistTemplateName,
  handleClick,
  showAddButton,
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
    {showAddButton && (
      <Fab aria-label="add" color="secondary" onClick={handleClick()} size="small" style={{ marginLeft: '1rem', width: '34px', height: '20px' }} title="Add Docs Received">
        <AddIcon />
      </Fab>
    )}
    <span styleName="spacer" />
    {children}
  </header>
);

ContentHeader.defaultProps = {
  children: null,
  title: 'FE Underwriter',
  checklistTemplateName: '',
  handleClick: () => {},
  showAddButton: false,
};

ContentHeader.propTypes = {
  checklistTemplateName: PropTypes.string,
  children: PropTypes.node,
  handleClick: PropTypes.func,
  showAddButton: PropTypes.bool,
  title: PropTypes.node,
};

export default ContentHeader;

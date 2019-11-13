import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import styles from './ContentHeader.css';
import DashboardModel from '../../models/Dashboard';

const renderBackButtonPage = '/stager';
const ContentHeader = ({
  title,
  children,
  checklistTemplateName,
  handleClick,
  showAddButton,
  group,
}) => (
  <header styleName="content-header">
    {group === DashboardModel.POSTMODSTAGER ? (
      <Link to={renderBackButtonPage}>
        &lt; BACK
      </Link>
    ) : null}

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
  group: '',
  title: 'FE Underwriter',
  checklistTemplateName: '',
  handleClick: () => { },
  showAddButton: false,
};

ContentHeader.propTypes = {
  checklistTemplateName: PropTypes.string,
  children: PropTypes.node,
  group: PropTypes.string,
  handleClick: PropTypes.func,
  showAddButton: PropTypes.bool,
  title: PropTypes.node,
};

export default ContentHeader;

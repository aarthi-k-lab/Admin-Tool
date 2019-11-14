import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import styles from './ContentHeader.css';
import EndShift from '../../models/EndShift';
import { operations, selectors } from '../../state/ducks/dashboard';
import DashboardModel from '../../models/Dashboard';

const renderBackButtonPage = '/stager';
const handleBackButton = (onAutoSave,
  onEndShift,
  enableGetNext,
  evalId,
  isAssigned) => {
  if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
    onAutoSave('Paused');
    onEndShift(EndShift.CLEAR_DASHBOARD_DATA);
  }
};
const ContentHeader = ({
  title,
  children,
  checklistTemplateName,
  handleClick,
  showAddButton,
  group,
  onAutoSave,
  onEndShift,
  enableGetNext,
  evalId,
  isAssigned,
}) => (
  <header styleName="content-header">
    {group === DashboardModel.POSTMODSTAGER ? (
      <Link
        onClick={() => handleBackButton(onAutoSave,
          onEndShift,
          enableGetNext,
          evalId,
          isAssigned)}
        to={renderBackButtonPage}
      >
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
  enableGetNext: false,
  evalId: '',
  isAssigned: false,
  onAutoSave: () => { },
  onEndShift: () => { },
};

ContentHeader.propTypes = {
  checklistTemplateName: PropTypes.string,
  children: PropTypes.node,
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string,
  group: PropTypes.string,
  handleClick: PropTypes.func,
  isAssigned: PropTypes.bool,
  onAutoSave: PropTypes.func,
  onEndShift: PropTypes.func,
  showAddButton: PropTypes.bool,
  title: PropTypes.node,
};

const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  isAssigned: selectors.isAssigned(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
});
const TestExports = {
  ContentHeader,
};
export default connect(mapStateToProps, mapDispatchToProps)(ContentHeader);
export { TestExports };

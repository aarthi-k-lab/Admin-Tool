import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Switch from '@material-ui/core/Switch';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import { selectors as configSelectors } from 'ducks/config';
import { selectors as loginSelectors } from 'ducks/login';
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
  }
  onEndShift(EndShift.CLEAR_DASHBOARD_DATA);
};

const handleAzureToggle = (event, handleToggle) => {
  handleToggle(event.target.checked);
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
  handleToggle,
  azureSearchToggle,
  features,
  isUtilGroupPresent,
  toggleButton,
}) => (
  <header styleName="content-header">
    {group === DashboardModel.POSTMODSTAGER || group === DashboardModel.UWSTAGER ? (
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
      <Fab
        aria-label="add"
        color="secondary"
        onClick={handleClick()}
        size="small"
        styleName="plusIcon"
        title="Add Docs Received"
      >
        <AddIcon />
      </Fab>
    )}
    {R.propOr(false, 'azureSearchToggle', features) && isUtilGroupPresent && toggleButton && (
    <>
      <h4>Azure Search</h4>
      <h4>NO</h4>
      <Switch
        checked={azureSearchToggle}
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
        name="toggleEL"
        onChange={event => handleAzureToggle(event, handleToggle)}
      />
      <h4>YES</h4>

    </>
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
  azureSearchToggle: PropTypes.bool.isRequired,
  checklistTemplateName: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node),
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.shape).isRequired,
  group: PropTypes.string,
  handleClick: PropTypes.func,
  handleToggle: PropTypes.func.isRequired,
  isAssigned: PropTypes.bool,
  isUtilGroupPresent: PropTypes.bool.isRequired,
  onAutoSave: PropTypes.func,
  onEndShift: PropTypes.func,
  showAddButton: PropTypes.bool,
  title: PropTypes.string,
  toggleButton: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  isAssigned: selectors.isAssigned(state),
  azureSearchToggle: stagerSelectors.getAzureSearchToggle(state),
  features: configSelectors.getFeatures(state),
  isUtilGroupPresent: loginSelectors.isUtilGroupPresent(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  handleToggle: stagerOperations.handleAzureSearchToggle(dispatch),
});
const TestExports = {
  ContentHeader,
};
export default connect(mapStateToProps, mapDispatchToProps)(ContentHeader);
export { TestExports };

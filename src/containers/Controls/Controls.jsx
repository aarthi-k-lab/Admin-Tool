import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  EndShift, Expand, GetNext, Assign, Unassign,
} from 'components/ContentHeader';
import classNames from 'classnames';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import EndShiftModel from 'models/EndShift';
import { selectors as loginSelectors } from 'ducks/login';
import { selectors as checklistSelectors } from 'ducks/tasks-and-checklist';
import RouteAccess from 'lib/RouteAccess';
import styles from '../Dashboard/TasksAndChecklist/TasksAndChecklist.css';
import Control from '../Dashboard/TasksAndChecklist/Controls';

class Controls extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handlegetNext = this.handlegetNext.bind(this);
  }

  handlegetNext() {
    const {
      onGetNext, groupName,
      isFirstVisit, dispositionCode,
    } = this.props;
    onGetNext({ appGroupName: groupName, isFirstVisit, dispositionCode });
  }

  validateDisposition() {
    const { groupName, validateDispositionTrigger, dispositionCode } = this.props;
    const payload = {
      dispositionReason: dispositionCode,
      group: groupName,
    };
    validateDispositionTrigger(payload);
  }

  render() {
    const {
      disableValidation,
      enableEndShift,
      enableGetNext,
      groupName,
      onEndShift,
      onExpand,
      showEndShift,
      showGetNext,
      showAssign,
      showValidate,
      user,
    } = this.props;
    let assign = null;
    const onEndShiftClick = () => onEndShift(
      EndShiftModel.SAVE_DISPOSITION_AND_CLEAR_DASHBOARD_DATA,
    );
    const validate = showValidate ? (
      <Control
        className={classNames(styles.controls, styles.spacer)}
        controlAction={() => this.validateDisposition()}
        disableValidation={disableValidation}
        label="Validate"
      />) : null;
    const getNext = showGetNext
      ? <GetNext disabled={!enableGetNext} onClick={this.handlegetNext} /> : null;
    const endShift = showEndShift
      ? <EndShift disabled={!enableEndShift} onClick={onEndShiftClick} />
      : null;
    const expand = <Expand onClick={onExpand} />;
    if (showAssign != null && !showAssign) {
      assign = <Assign />;
    }
    const groups = user && user.groupList;
    if (RouteAccess.hasManagerDashboardAccess(groups) && showAssign) {
      assign = <Unassign />;
    }
    return (
      <>
        {assign}
        {groupName === 'feuw-task-checklist' ? validate : null}
        {endShift}
        {getNext}
        {expand}
      </>
    );
  }
}

Controls.defaultProps = {
  enableEndShift: false,
  enableGetNext: false,
  isFirstVisit: true,
  onEndShift: () => { },
  onExpand: () => { },
  onGetNext: () => { },
  showEndShift: false,
  showGetNext: false,
  showAssign: null,
  showValidate: false,
};

Controls.propTypes = {
  disableValidation: PropTypes.bool.isRequired,
  dispositionCode: PropTypes.string.isRequired,
  enableEndShift: PropTypes.bool,
  enableGetNext: PropTypes.bool,
  groupName: PropTypes.string.isRequired,
  isFirstVisit: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  onEndShift: PropTypes.func,
  onExpand: PropTypes.func,
  onGetNext: PropTypes.func,
  showAssign: PropTypes.bool,
  showEndShift: PropTypes.bool,
  showGetNext: PropTypes.bool,
  showValidate: PropTypes.bool,
  user: PropTypes.shape({
    skills: PropTypes.objectOf(PropTypes.string).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
  validateDispositionTrigger: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const showDisposition = checklistSelectors.shouldShowDisposition(state);
  const isNotAssigned = !selectors.isAssigned(state);
  const disableValidation = isNotAssigned || !showDisposition;
  return {
    disableValidation,
    enableEndShift: selectors.enableEndShift(state),
    enableGetNext: selectors.enableGetNext(state),
    dispositionCode: checklistSelectors.getDispositionCode(state),
    isFirstVisit: selectors.isFirstVisit(state),
    showAssign: selectors.showAssign(state),
    user: loginSelectors.getUser(state),
    groupName: selectors.groupName(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onExpand: operations.onExpand(dispatch),
  onGetNext: operations.onGetNext(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  validateDispositionTrigger: operations.validateDispositionTrigger(dispatch),
  onAssignLoan: operations.onAssignLoan(dispatch),
});

const ControlsContainer = connect(mapStateToProps, mapDispatchToProps)(Controls);

const TestHooks = {
  Controls,
};

export default ControlsContainer;
export { TestHooks };

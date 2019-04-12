import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  EndShift, Expand, GetNext, Assign, Unassign, SendToUnderwriting,
} from 'components/ContentHeader';
import classNames from 'classnames';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import EndShiftModel from 'models/EndShift';
import AppGroupName from 'models/AppGroupName';
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
      enableValidate,
      enableGetNext,
      groupName,
      onEndShift,
      onExpand,
      showEndShift,
      showGetNext,
      showSendToUnderWritingIcon,
      showAssign,
      showValidate,
      isFirstVisit,
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
      ? (
        <GetNext
          disabled={!enableGetNext || (!enableValidate && !isFirstVisit)}
          onClick={this.handlegetNext}
        />
      ) : null;
    const endShift = showEndShift
      ? <EndShift disabled={!enableEndShift || !enableValidate} onClick={onEndShiftClick} />
      : null;
    const getSendToUnderWritingButton = showSendToUnderWritingIcon
      ? <SendToUnderwriting /> : null;
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
        {AppGroupName.hasChecklist(groupName) ? validate : null}
        {endShift}
        {getNext}
        {getSendToUnderWritingButton}
        {expand}
      </>
    );
  }
}

Controls.defaultProps = {
  enableEndShift: false,
  enableGetNext: false,
  enableValidate: false,
  isFirstVisit: true,
  onEndShift: () => { },
  onExpand: () => { },
  onGetNext: () => { },
  showEndShift: false,
  showGetNext: false,
  showSendToUnderWritingIcon: false,
  showAssign: null,
  showValidate: false,
};

Controls.propTypes = {
  disableValidation: PropTypes.bool.isRequired,
  dispositionCode: PropTypes.string.isRequired,
  enableEndShift: PropTypes.bool,
  enableGetNext: PropTypes.bool,
  enableValidate: PropTypes.bool,
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
  showSendToUnderWritingIcon: PropTypes.bool,
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
  const enableValidate = checklistSelectors.enableValidate(state);
  const disableValidation = isNotAssigned || !showDisposition || !enableValidate;
  return {
    disableValidation,
    enableValidate,
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

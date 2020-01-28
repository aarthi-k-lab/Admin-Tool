import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  EndShift, Expand, GetNext, Assign, Unassign, SendToUnderwriting,
  SendToDocGen, SendToDocGenStager, ContinueMyReview, SendToDocsIn, CompleteMyReview,
} from 'components/ContentHeader';
import classNames from 'classnames';
import DashboardModel from 'models/Dashboard';
import {
  operations,
  selectors,
} from 'ducks/dashboard';
import EndShiftModel from 'models/EndShift';
import AppGroupName from 'models/AppGroupName';
import { selectors as loginSelectors } from 'ducks/login';
import { selectors as checklistSelectors } from 'ducks/tasks-and-checklist';
import RouteAccess from 'lib/RouteAccess';
import * as R from 'ramda';
import hotkeys from 'hotkeys-js';
import styles from '../Dashboard/TasksAndChecklist/TasksAndChecklist.css';
import Control from '../Dashboard/TasksAndChecklist/Controls';

const HOTKEY_V = ['v', 'V'];
const HOTKEY_M = ['m', 'M'];
const HOTKEY_E = ['e', 'E'];
const HOTKEY_G = ['g', 'G'];

class Controls extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handlegetNext = this.handlegetNext.bind(this);
    this.handleSentToUnderwriting = this.handleSentToUnderwriting.bind(this);
    this.showAssignForThisGroup = this.showAssignForThisGroup.bind(this);
    this.handleSendToDocGen = this.handleSendToDocGen.bind(this);
    this.handleSendToDocGenStager = this.handleSendToDocGenStager.bind(this);
    this.handleContinueMyReview = this.handleContinueMyReview.bind(this);
    this.handleAddDocsInReceived = this.handleAddDocsInReceived.bind(this);
    this.handleSendToDocsIn = this.handleSendToDocsIn.bind(this);
  }

  componentDidMount() {
    hotkeys('g,v,m,e', (event, handler) => {
      if (event.type === 'keydown') {
        this.handleHotKeyPress(handler);
      }
    });
  }

  componentWillUnmount() {
    hotkeys.unbind('v,g,m,e');
  }

  handleHotKeyPress = (handler) => {
    const {
      disableValidation,
      enableGetNext,
      enableValidate,
      isFirstVisit,
      onExpand,
      enableEndShift,
      onEndShift,
    } = this.props;
    if (HOTKEY_V.includes(handler.key) && !disableValidation) {
      this.validateDisposition();
    } else if (HOTKEY_G.includes(handler.key) && !(!enableGetNext
   || (!enableValidate && !isFirstVisit))) {
      this.handlegetNext();
    } else if (HOTKEY_M.includes(handler.key)) {
      onExpand();
    } else if (HOTKEY_E.includes(handler.key) && !(!enableEndShift || !enableValidate)) {
      const onEndShiftClick = () => onEndShift(
        EndShiftModel.SAVE_DISPOSITION_AND_CLEAR_DASHBOARD_DATA,
      );
      onEndShiftClick();
    }
  }

  handleCompleteMyReview = () => {
    const { onCompleteMyReview } = this.props;
    onCompleteMyReview('Complete My Review');
  }

  handleSendToDocGen() {
    const { onSendToDocGen } = this.props;
    onSendToDocGen(false);
  }

  handleSendToDocsIn() {
    const { onSendToDocsIn } = this.props;
    onSendToDocsIn();
  }

  handleAddDocsInReceived() {
    const { history } = this.props;
    history.push('/bulkOrder-page');
  }

  handleSendToDocGenStager() {
    const { onSendToDocGen } = this.props;
    onSendToDocGen(true);
  }

  handleContinueMyReview() {
    const { onContinueMyReview } = this.props;
    onContinueMyReview('Assigned');
  }

  handleSentToUnderwriting() {
    const { onSentToUnderwriting } = this.props;
    onSentToUnderwriting();
  }

  handlegetNext() {
    const {
      onGetNext, groupName,
      isFirstVisit, dispositionCode,
    } = this.props;
    onGetNext({ appGroupName: groupName, isFirstVisit, dispositionCode });
  }

  validateDisposition() {
    const {
      groupName, validateDispositionTrigger, dispositionCode,
      showUpdateRemedy,
    } = this.props;
    const payload = {
      dispositionReason: dispositionCode,
      group: groupName,
      isAuto: showUpdateRemedy,
    };
    validateDispositionTrigger(payload);
  }

  showAssignForThisGroup() {
    const { groupName } = this.props;
    return R.prop('showAssignUnassign', R.find(R.propEq('group', groupName), DashboardModel.GROUP_INFO));
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
      showSendToDocGenStager,
      showSendToDocGen,
      showSendToDocsIn,
      showContinueMyReview,
      showCompleteMyReview,
      showAssign,
      showValidate,
      isFirstVisit,
      user,
      showUpdateRemedy,
      enableSendToDocGen,
      enableSendToDocsIn,
      enableSendToUW,
    } = this.props;
    let assign = null;
    const onEndShiftClick = () => onEndShift(
      EndShiftModel.SAVE_DISPOSITION_AND_CLEAR_DASHBOARD_DATA,
    );
    const validate = showValidate || showUpdateRemedy ? (
      <Control
        className={classNames(styles.controls, styles.spacer)}
        controlAction={() => this.validateDisposition()}
        disableValidation={disableValidation}
        label={showValidate ? 'Validate' : 'Update Remedy'}
      />
    ) : null;
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
      ? (
        <SendToUnderwriting
          disabled={!enableSendToUW}
          onClick={this.handleSentToUnderwriting}
        />
      ) : null;
    const getSendToDocGenStagerButton = showSendToDocGenStager
      ? (
        <SendToDocGenStager
          disabled={!enableSendToDocGen}
          onClick={this.handleSendToDocGenStager}
        />
      ) : null;
    const getSendToDocGenButton = showSendToDocGen
      ? <SendToDocGen disabled={!enableSendToDocGen} onClick={this.handleSendToDocGen} /> : null;
    const getSendToDocsInButton = showSendToDocsIn
      ? <SendToDocsIn disabled={!enableSendToDocsIn} onClick={this.handleSendToDocsIn} /> : null;
    const expand = <Expand onClick={onExpand} />;
    if (
      showAssign != null
      && !showAssign
      && this.showAssignForThisGroup()
    ) {
      assign = <Assign />;
    }
    const groups = user && user.groupList;
    if (
      RouteAccess.hasManagerDashboardAccess(groups)
      && showAssign
      && this.showAssignForThisGroup()
    ) {
      assign = <Unassign />;
    }
    const getContinueMyReviewButton = showContinueMyReview
      ? <ContinueMyReview onClick={this.handleContinueMyReview} /> : null;

    const getCompleteMyreviewButton = showCompleteMyReview && groupName === DashboardModel.BOOKING
      ? <CompleteMyReview onClick={this.handleCompleteMyReview} /> : null;
    return (
      <>
        {assign}
        {AppGroupName.hasChecklist(groupName) ? validate : null}
        {endShift}
        {getNext}
        {getSendToUnderWritingButton}
        {getSendToDocGenButton}
        {getSendToDocGenStagerButton}
        {getSendToDocsInButton}
        {getContinueMyReviewButton}
        {getCompleteMyreviewButton}
        {expand}
      </>
    );
  }
}

Controls.defaultProps = {
  enableEndShift: false,
  enableGetNext: false,
  enableSendToDocGen: true,
  enableSendToDocsIn: true,
  enableSendToUW: true,
  enableValidate: false,
  isFirstVisit: true,
  onEndShift: () => { },
  onExpand: () => { },
  onGetNext: () => { },
  onSentToUnderwriting: () => { },
  onSendToDocGen: () => { },
  onSendToDocsIn: () => { },
  showEndShift: false,
  showGetNext: false,
  showSendToUnderWritingIcon: false,
  showSendToDocGen: false,
  showSendToDocsIn: false,
  showSendToDocGenStager: false,
  onContinueMyReview: () => { },
  onCompleteMyReview: () => { },
  showContinueMyReview: null,
  showAssign: null,
  showValidate: false,
  groupName: null,
};

Controls.propTypes = {
  disableValidation: PropTypes.bool.isRequired,
  dispositionCode: PropTypes.string.isRequired,
  enableEndShift: PropTypes.bool,
  enableGetNext: PropTypes.bool,
  enableSendToDocGen: PropTypes.bool,
  enableSendToDocsIn: PropTypes.bool,
  enableSendToUW: PropTypes.bool,
  enableValidate: PropTypes.bool,
  groupName: PropTypes.string,
  history: PropTypes.shape(PropTypes.string).isRequired,
  isFirstVisit: PropTypes.bool,
  onCompleteMyReview: PropTypes.func,
  onContinueMyReview: PropTypes.func,
  onEndShift: PropTypes.func,
  onExpand: PropTypes.func,
  onGetNext: PropTypes.func,
  onSendToDocGen: PropTypes.func,
  onSendToDocsIn: PropTypes.func,
  onSentToUnderwriting: PropTypes.func,
  showAssign: PropTypes.bool,
  showCompleteMyReview: PropTypes.bool.isRequired,
  showContinueMyReview: PropTypes.bool,
  showEndShift: PropTypes.bool,
  showGetNext: PropTypes.bool,
  showSendToDocGen: PropTypes.bool,
  showSendToDocGenStager: PropTypes.bool,
  showSendToDocsIn: PropTypes.bool,
  showSendToUnderWritingIcon: PropTypes.bool,
  showUpdateRemedy: PropTypes.bool.isRequired,
  showValidate: PropTypes.bool,
  user: PropTypes.shape({
    groupList: PropTypes.array,
    skills: PropTypes.objectOf(PropTypes.array),
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
  const isAssigned = selectors.isAssigned(state);
  const group = selectors.groupName(state);
  const enableValidate = !checklistSelectors.showComment(state)
    ? true : checklistSelectors.enableValidate(state);
  const shouldSkipValidation = checklistSelectors.enableValidate(state)
  && (group === DashboardModel.POSTMODSTAGER || group === DashboardModel.ALL_STAGER);
  const disableValidation = !isAssigned || !showDisposition || !enableValidate;
  return {
    disableValidation,
    enableValidate,
    enableEndShift: selectors.enableEndShift(state) || shouldSkipValidation,
    enableGetNext: selectors.enableGetNext(state)
      || shouldSkipValidation,
    enableSendToDocGen: selectors.enableSendToDocGen(state),
    enableSendToDocsIn: selectors.enableSendToDocsIn(state),
    enableSendToUW: selectors.enableSendToUW(state),
    dispositionCode: checklistSelectors.getDispositionCode(state),
    isFirstVisit: selectors.isFirstVisit(state),
    showAssign: selectors.showAssign(state),
    showContinueMyReview: selectors.showContinueMyReview(state),
    showCompleteMyReview: selectors.showCompleteMyReview(state),
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
  onSentToUnderwriting: operations.onSentToUnderwriting(dispatch),
  onSendToDocGen: operations.onSendToDocGen(dispatch),
  onSendToDocsIn: operations.onSendToDocsIn(dispatch),
  onContinueMyReview: operations.onContinueMyReview(dispatch),
  onCompleteMyReview: operations.onCompleteMyReview(dispatch),
});

const ControlsContainer = connect(mapStateToProps, mapDispatchToProps)(Controls);

const TestHooks = {
  Controls,
};

export default withRouter(ControlsContainer);
export { TestHooks };

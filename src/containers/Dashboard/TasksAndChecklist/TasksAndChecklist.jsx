import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import classNames from 'classnames';
import TaskPane from 'containers/Dashboard/TaskPane';
import Checklist from 'components/Checklist';
import Loader from 'components/Loader/Loader';
import DashboardModel from 'models/Dashboard';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import { selectors as dashboardSelectors, operations as dashboardOperations } from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import UserNotification from 'components/UserNotification/UserNotification';
import DispositionModel from 'models/Disposition';
import ChecklistErrorMessageCodes from 'models/ChecklistErrorMessageCodes';
import CustomSnackBar from 'components/CustomSnackBar';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import hotkeys from 'hotkeys-js';
import CloseIcon from '@material-ui/icons/Close';
import widgets from '../../../constants/widget';
import BookingHomePage from './BookingHomePage';
import Navigation from './Navigation';
import DialogCard from './DialogCard';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import styles from './TasksAndChecklist.css';
import componentTypes from '../../../constants/componentTypes';

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
class TasksAndChecklist extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { setHomepageVisible } = this.props;
    hotkeys('right,left', (event) => {
      if (event.type === 'keydown') {
        this.handleHotKeyPress();
      }
    });
    setHomepageVisible(false);
  }

  componentWillUnmount() {
    hotkeys.unbind('right,left');
    this.handleClose();
  }

  getChecklistItems() {
    const {
      filter, checklistItems, passedRules, failedRules,
    } = this.props;
    if (R.isNil(filter)) {
      return checklistItems;
    }
    return filter ? passedRules : failedRules;
  }

  handleHotKeyPress = () => {
    const {
      disableNext,
      disablePrev,
      onNext,
      onPrev,
    } = this.props;
    if (!disableNext && hotkeys.getPressedKeyCodes().includes(RIGHT_KEY)) {
      onNext();
    } else if (!disablePrev && hotkeys.getPressedKeyCodes().includes(LEFT_KEY)) {
      onPrev();
    }
  }

  handleClose = () => {
    const { onUnassignBookingLoan, onWidgetToggle } = this.props;
    onUnassignBookingLoan();
    onWidgetToggle(false);
  }

  handleSubTaskClearance(isConfirmed) {
    if (isConfirmed) {
      const {
        handleClearSubTask,
        rootTaskId, selectedTaskId,
        selectedTaskBlueprintCode,
      } = this.props;
      handleClearSubTask(selectedTaskId, rootTaskId, selectedTaskBlueprintCode);
    }
  }

  handleChange(value, widgetId) {
    const { groupName, setHomepageVisible, getHomePagevisible } = this.props;
    if (R.equals(widgetId, widgets.booking)) {
      if (groupName === DashboardModel.BOOKING) {
        setHomepageVisible(!getHomePagevisible);
      } else {
        const {
          onWidgetClick, onUnassignBookingLoan, toggleWidget, onWidgetToggle,
        } = this.props;
        if (toggleWidget) {
          onUnassignBookingLoan();
        } else {
          onWidgetClick();
        }
        onWidgetToggle(!toggleWidget);
      }
    }
  }

  renderTaskErrorMessage() {
    const { checklistErrorMessage } = this.props;
    if (checklistErrorMessage) {
      return (
        <div styleName="notificationMsg">
          <UserNotification
            level="error"
            message={checklistErrorMessage}
            type="alert-box"
          />
        </div>
      );
    }
    return null;
  }


  renderChecklist() {
    const {
      checklistItems,
      checklistTitle,
      dataLoadStatus,
      message,
      onChecklistChange,
      disposition,
      enableGetNext, isAssigned, noTasksFound, taskFetchError,
      user,
      showAssign,
      isDialogOpen,
      getDialogContent,
      dialogTitle,
      handleDeleteTask,
      handleShowDeleteTaskConfirmation,
      failedRules,
      passedRules,
      location,
      resolutionId,
      groupName,
      resolutionData,
      closeSweetAlert,
      putComputeRulesPassed,
      ruleResultFromTaskTree,
    } = this.props;
    if (dataLoadStatus === 'loading') {
      return <CircularProgress styleName="loader" />;
    }
    if (dataLoadStatus === 'failed') {
      return <ErrorIcon fontSize="large" styleName="error-indicator" />;
    }
    if (checklistItems.length <= 0) {
      return null;
    }
    let notification;
    if (message.type === 'do-not-display') {
      notification = null;
    } else {
      notification = DashboardModel.Messages.renderErrorNotification(
        disposition,
        enableGetNext, isAssigned, noTasksFound, taskFetchError,
        message.msg,
        user,
        showAssign,
      );
    }
    let styleName = 'checklist';
    const { toggleWidget } = this.props;
    if (groupName === DashboardModel.BOOKING || toggleWidget) {
      styleName = 'sla-rules';
      if (checklistItems && checklistItems[0].showPushData) {
        styleName = 'pushData';
      }
    }
    return (
      <Checklist
        checklistItems={this.getChecklistItems()}
        closeSweetAlert={closeSweetAlert}
        dialogContent={getDialogContent}
        dialogTitle={dialogTitle}
        failedRules={failedRules}
        handleClearSubTask={isConfirmed => this.handleSubTaskClearance(isConfirmed)}
        handleDeleteTask={handleDeleteTask}
        handleShowDeleteTaskConfirmation={handleShowDeleteTaskConfirmation}
        isDialogOpen={isDialogOpen}
        location={location}
        onChange={onChecklistChange}
        onCompleteMyReviewClick={this.handleClose}
        passedRules={passedRules}
        putComputeRulesPassed={putComputeRulesPassed}
        resolutionData={resolutionData}
        resolutionId={resolutionId}
        ruleResultFromTaskTree={ruleResultFromTaskTree}
        styleName={styleName}
        title={checklistTitle}
        triggerHeader={toggleWidget}
      >
        {notification}
      </Checklist>
    );
  }

  renderSnackBar() {
    const { snackBarData, closeSnackBar } = this.props;
    return (
      <CustomSnackBar
        message={snackBarData && snackBarData.message}
        onClose={closeSnackBar}
        open={snackBarData && snackBarData.open}
        type={snackBarData && snackBarData.type}
      />
    );
  }

  render() {
    const {
      commentsRequired,
      instructions,
      disableNext,
      disablePrev,
      disposition,
      groupName,
      inProgress,
      noTasksFound,
      onNext,
      onPrev,
      onInstuctionDialogToggle,
      showDisposition,
      showInstructionsDialog,
      taskFetchError,
      isGetNextError,
      isPostModEndShift,
      completeReviewResponse,
      history,
      isAssigned,
      toggleWidget,
      getHomePagevisible,
    } = this.props;
    const showDialogBox = (isAssigned && showDisposition);
    const bookingHomepageMsg = (isAssigned === true) ? 'Booking Widget' : 'Assign to me';
    if (isPostModEndShift) {
      history.push('/stager');
    }
    if (completeReviewResponse && !R.prop('error', completeReviewResponse)) {
      history.push('/special-loan');
    }
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    if (noTasksFound || taskFetchError || isGetNextError) {
      return (
        <>
          { this.renderTaskErrorMessage() }
          {groupName === DashboardModel.BOOKING || groupName === DashboardModel.DOCS_IN
            ? <WidgetBuilder styleName={toggleWidget ? 'task-checklist-bw' : 'task-checklist'} triggerHeader={this.handleChange} /> : null }
        </>
      );
    }

    const isHeaderVisible = toggleWidget && !R.equals(groupName, DashboardModel.BOOKING);
    const dispositionMessage = R.is(Array, disposition) ? R.join(',', disposition) : disposition;
    return (
      <div styleName="scroll-wrapper">
        {isHeaderVisible && (
          <div styleName="bookingWidget">
            <span styleName="widgetTitle">
              BOOKING AUTOMATION
            </span>
            <span styleName="widgetClose">
              <CloseIcon onClick={this.handleClose} />
            </span>
          </div>
        )
        }
        <section styleName="tasks-and-checklist">
          { !getHomePagevisible
            ? (
              <>
                <TaskPane styleName="tasks" />
                {this.renderChecklist()}
              </>
            )
            : <BookingHomePage message={bookingHomepageMsg} />}
          {this.renderSnackBar()}
          <DialogCard
            commentsRequired={commentsRequired}
            dialogContent={instructions}
            dialogHeader="Steps to Resolve"
            message={dispositionMessage}
            onDialogToggle={onInstuctionDialogToggle}
            shouldShow={showDialogBox}
            showDialog={showInstructionsDialog}
            styleName="instructions"
            title="Disposition"
          />
          <WidgetBuilder styleName={toggleWidget ? 'task-checklist-bw' : 'task-checklist'} triggerHeader={this.handleChange} />
          <Navigation
            className={classNames(styles.footer, styles.navigation)}
            disableNext={disableNext}
            disablePrev={disablePrev}
            onNext={onNext}
            onPrev={onPrev}
          />
        </section>
      </div>
    );
  }
}

TasksAndChecklist.defaultProps = {
  enableGetNext: false,
  inProgress: false,
  message: null,
  noTasksFound: false,
  isGetNextError: false,
  taskFetchError: false,
  isDialogOpen: false,
  dialogTitle: '',
  getDialogContent: '',
  snackBarData: null,
  showAssign: false,
  isPostModEndShift: false,
  resolutionData: [],
  toggleWidget: false,
  ruleResultFromTaskTree: [],
  setHomepageVisible: false,
  getHomePagevisible: false,
};

TasksAndChecklist.propTypes = {
  assignResult: PropTypes.shape({
    cmodProcess: PropTypes.shape({
      taskStatus: PropTypes.string.isRequired,
    }),
    status: PropTypes.string,
    statusCode: PropTypes.string,
    taskData: PropTypes.shape({
      evalId: PropTypes.string.isRequired,
      groupName: PropTypes.string.isRequired,
      loanNumber: PropTypes.string.isRequired,
      processStatus: PropTypes.string.isRequired,
      taskCheckListId: PropTypes.string.isRequired,
      taskCheckListTemplateName: PropTypes.string.isRequired,
      wfProcessId: PropTypes.string.isRequired,
      wfTaskId: PropTypes.string.isRequired,
    }),
  }).isRequired,
  checklistErrorMessage: PropTypes.string.isRequired,
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })),
      showPushData: PropTypes.bool,
      taskCode: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(Object.values(componentTypes)).isRequired,
    }),
  ).isRequired,
  // checklistId: PropTypes.string.isRequired,
  checklistTitle: PropTypes.string.isRequired,
  closeSnackBar: PropTypes.func.isRequired,
  closeSweetAlert: PropTypes.func.isRequired,
  commentsRequired: PropTypes.bool.isRequired,
  completeReviewResponse: PropTypes.shape.isRequired,
  dataLoadStatus: PropTypes.string.isRequired,
  dialogTitle: PropTypes.string,
  disableNext: PropTypes.bool.isRequired,
  disablePrev: PropTypes.bool.isRequired,
  disposition: PropTypes.string.isRequired,
  enableGetNext: PropTypes.bool,
  failedRules: PropTypes.shape.isRequired,
  filter: PropTypes.bool.isRequired,
  getDialogContent: PropTypes.string,
  getHomePagevisible: PropTypes.bool,
  groupName: PropTypes.string.isRequired,
  handleClearSubTask: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  inProgress: PropTypes.bool,
  instructions: PropTypes.string.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  isDialogOpen: PropTypes.bool,
  isGetNextError: PropTypes.bool,
  isPostModEndShift: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string.isRequired,
  }).isRequired,
  message: PropTypes.shape({
    msg: PropTypes.string,
    type: PropTypes.string,
  }),
  noTasksFound: PropTypes.bool,
  onChecklistChange: PropTypes.func.isRequired,
  onInstuctionDialogToggle: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onUnassignBookingLoan: PropTypes.func.isRequired,
  onWidgetClick: PropTypes.func.isRequired,
  onWidgetToggle: PropTypes.func.isRequired,
  passedRules: PropTypes.shape.isRequired,
  putComputeRulesPassed: PropTypes.func.isRequired,
  resolutionData: PropTypes.arrayOf(PropTypes.string),
  resolutionId: PropTypes.string.isRequired,
  rootTaskId: PropTypes.string.isRequired,
  ruleResultFromTaskTree: PropTypes.arrayOf(PropTypes.shape),
  selectedTaskBlueprintCode: PropTypes.string.isRequired,
  selectedTaskId: PropTypes.string.isRequired,
  setHomepageVisible: PropTypes.bool,
  showAssign: PropTypes.bool,
  showDisposition: PropTypes.bool.isRequired,
  showInstructionsDialog: PropTypes.bool.isRequired,
  snackBarData: PropTypes.node,
  taskFetchError: PropTypes.bool,
  toggleWidget: PropTypes.bool,
  user: PropTypes.shape({

    skills: PropTypes.objectOf(PropTypes.array).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

function getUserNotification(message) {
  if (message.type === 'success') {
    return message;
  }
  if (message.type === 'error') {
    return {
      type: 'error',
      msg: R.has('data', message) ? DispositionModel.getErrorMessages(message.data) : message.msg,
    };
  }
  return {
    type: 'do-not-display',
  };
}

function getChecklistErrorMessage(checklistErrorCode, taskFetchError,
  noTasksFound, isGetNextError, getNextError) {
  if ((!(taskFetchError || noTasksFound)) && !isGetNextError) {
    return '';
  }
  switch (checklistErrorCode) {
    case ChecklistErrorMessageCodes.NO_CHECKLIST_ID_PRESENT:
      return 'Checklist not found.';
    case ChecklistErrorMessageCodes.CHECKLIST_FETCH_FAILED:
      return 'Checklist fetch failed. Please try again later.';
    default:
      break;
  }
  if (taskFetchError) {
    return 'Task Fetch Failed.Please try again Later';
  }
  if (noTasksFound) {
    return 'No tasks assigned.Please contact your manager';
  }
  if (isGetNextError) {
    return getNextError;
  }
  return '';
}

function mapStateToProps(state) {
  const noTasksFound = dashboardSelectors.noTasksFound(state);
  const taskFetchError = dashboardSelectors.taskFetchError(state);
  const checklistErrorCode = dashboardSelectors.getChecklistErrorCode(state);
  const isGetNextError = dashboardSelectors.isGetNextError(state);
  const getNextError = dashboardSelectors.getNextError(state);

  return {
    disposition: selectors.getDisposition(state),
    dataLoadStatus: selectors.getChecklistLoadStatus(state),
    checklistErrorMessage: getChecklistErrorMessage(
      checklistErrorCode,
      taskFetchError,
      noTasksFound,
      isGetNextError,
      getNextError,
    ),
    assignResult: dashboardSelectors.assignResult(state),
    rootTaskId: selectors.getRootTaskId(state),
    commentsRequired: selectors.showComment(state),
    snackBarData: notificationSelectors.getSnackBarState(state),
    checklistItems: selectors.getChecklistItems(state),
    checklistTitle: selectors.getChecklistTitle(state),
    disableNext: selectors.shouldDisableNext(state),
    disablePrev: selectors.shouldDisablePrev(state),
    enableGetNext: dashboardSelectors.enableGetNext(state),
    isAssigned: dashboardSelectors.isAssigned(state),
    groupName: dashboardSelectors.groupName(state),
    inProgress: dashboardSelectors.inProgress(state),
    isPostModEndShift: dashboardSelectors.isPostModEndShift(state),
    completeReviewResponse: dashboardSelectors.completeReviewResponse(state),
    instructions: selectors.getInstructions(state),
    message: getUserNotification(dashboardSelectors.getChecklistDiscrepancies(state)),
    noTasksFound,
    isGetNextError,
    showAssign: dashboardSelectors.showAssign(state),
    getNextError,
    showDisposition: selectors.shouldShowDisposition(state),
    showInstructionsDialog: selectors.shouldShowInstructionsDialog(state),
    taskFetchError,
    user: loginSelectors.getUser(state),
    isDialogOpen: selectors.isDialogOpen(state),
    getDialogContent: selectors.getDialogContent(state),
    dialogTitle: selectors.getDialogTitle(state),
    selectedTaskId: selectors.selectedTaskId(state),
    selectedTaskBlueprintCode: selectors.selectedTaskBlueprintCode(state),
    passedRules: selectors.getPassedRules(state),
    failedRules: selectors.getFailedRules(state),
    filter: selectors.getFilter(state),
    resolutionId: selectors.getResolutionId(state),
    resolutionData: dashboardSelectors.getResolutionData(state),
    checklistId: selectors.getSelectedChecklistId(state),
    prevDocsInChecklistId: selectors.getPrevDocsInChecklistId(state),
    prevDocsInRootTaskId: selectors.getPrevDocsInRootTaskId(state),
    toggleWidget: dashboardSelectors.getToggleWidget(state),
    ruleResultFromTaskTree: selectors.getRuleResultFromTaskTree(state),
    getHomePagevisible: dashboardSelectors.getHomePagevisible(state),

  };
}

function mapDispatchToProps(dispatch) {
  return {
    onWidgetToggle: dashboardOperations.onWidgetToggle(dispatch),
    onUnassignBookingLoan: dashboardOperations.onUnassignBookingLoan(dispatch),
    onChecklistChange: operations.handleChecklistItemValueChange(dispatch),
    closeSnackBar: notificationOperations.closeSnackBar(dispatch),
    handleDeleteTask: operations.handleDeleteTask(dispatch),
    handleShowDeleteTaskConfirmation: operations.handleShowDeleteTaskConfirmation(dispatch),
    onNext: operations.fetchNextChecklist(dispatch),
    onPrev: operations.fetchPrevChecklist(dispatch),
    onInstuctionDialogToggle: operations.handleToggleInstructions(dispatch),
    handleClearSubTask: operations.handleSubTaskClearance(dispatch),
    onWidgetClick: dashboardOperations.onWidgetClick(dispatch),
    closeSweetAlert: dashboardOperations.closeSweetAlert(dispatch),
    putComputeRulesPassed: operations.putComputeRulesPassed(dispatch),
    setHomepageVisible: dashboardOperations.setHomepageVisible(dispatch),
  };
}

const TestHooks = {
  TasksAndChecklist,
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TasksAndChecklist));

export { TestHooks };

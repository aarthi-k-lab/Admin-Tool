import React, { Component } from 'react';
import hotkeys from 'hotkeys-js';
import * as R from 'ramda';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ErrorIcon from '@material-ui/icons/Error';
import classNames from 'classnames';
import TaskPane from 'containers/Dashboard/TaskPane';
import Checklist from 'components/Checklist';
import Loader from 'components/Loader/Loader';
import CustomSnackBar from 'components/CustomSnackBar';
import AdditionalInfo from 'containers/AdditionalInfo';
import DashboardModel from 'models/Dashboard';
import { withRouter } from 'react-router-dom';
import { ERROR, SUCCESS } from 'constants/common';
import UserNotification from 'components/UserNotification/UserNotification';
import DispositionModel from 'models/Disposition';
import ChecklistErrorMessageCodes from 'models/ChecklistErrorMessageCodes';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import { selectors as incomeSelectors } from 'ducks/income-calculator';
import { selectors as dashboardSelectors, operations as dashboardOperations } from 'ducks/dashboard';
import { selectors as widgetsSelectors, operations as widgetsOperations } from 'ducks/widgets';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import { selectors as loginSelectors } from 'ducks/login';
import { selectors as stagerSelectors } from 'ducks/stager';
import { closeWidgets } from 'components/Widgets/WidgetSelects';
import ErrorBanner from 'components/ErrorBanner';
import componentTypes from 'constants/componentTypes';
import IncomeCalcWidget from 'containers/IncomeCalc/IncomeCalcWidget';
import Popup from '../../../components/Popup';
import MilestoneActivity from '../../LoanActivity/MilestoneActivity';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import BookingHomePage from './BookingHomePage';
import Navigation from './Navigation';
import DialogCard from './DialogCard';
import styles from './TasksAndChecklist.css';
import {
  BOOKING, HISTORY, ADDITIONAL_INFO, INCOME_CALCULATOR,
} from '../../../constants/widgets';

const { Messages: { MSG_NO_TASKS_FOUND, MSG_TASK_FETCH_ERROR } } = DashboardModel;

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
class TasksAndChecklist extends Component {
  componentDidMount() {
    const {
      onWidgetToggle, groupName, openWidgetList,
    } = this.props;
    hotkeys('right,left', (event) => {
      if (event.type === 'keydown') {
        this.handleHotKeyPress();
      }
    });
    if (R.equals(groupName, DashboardModel.BOOKING)
    && !(R.contains(ADDITIONAL_INFO, openWidgetList) || R.contains(HISTORY, openWidgetList))) {
      const payload = {
        currentWidget: BOOKING,
        openWidgetList: [BOOKING],
      };
      onWidgetToggle(payload);
    }
  }

  componentWillUnmount() {
    hotkeys.unbind('right,left');
    const {
      openWidgetList,
    } = this.props;
    if (R.contains(BOOKING, openWidgetList)) {
      this.handleClose();
    }
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

  shouldRenderWidgetView = () => {
    const { openWidgetList } = this.props;
    return R.any(widget => R.contains(
      widget, [HISTORY, ADDITIONAL_INFO, INCOME_CALCULATOR],
    ))(openWidgetList);
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
    const { onWidgetToggle, openWidgetList, groupName } = this.props;
    const widgetsToBeClosed = {
      openWidgetList,
      page: groupName,
      closingWidgets: [BOOKING],
    };
    const payload = {
      currentWidget: '',
      openWidgetList: closeWidgets(widgetsToBeClosed),
    };
    onWidgetToggle(payload);
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
      getSelectedWidget,
      openWidgetList,
      incomeCalcInProgress,
      taskName,
      delayChecklistHistory,
    } = this.props;

    if (dataLoadStatus === 'failed') {
      return <ErrorIcon fontSize="large" styleName="error-indicator" />;
    }
    if (checklistItems && checklistItems.length <= 0) {
      return null;
    }
    let notification;
    if (!message || message.type === 'do-not-display') {
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
    if (checklistItems && R.equals(R.prop('type', R.head(checklistItems)), 'income-calculator')) {
      styleName = 'incomeCalc';
    }
    const isBookingWidgetOpen = R.contains(BOOKING, openWidgetList);
    if (groupName === DashboardModel.BOOKING || isBookingWidgetOpen) {
      styleName = 'sla-rules';
      if (checklistItems && checklistItems[0].showPushData) {
        styleName = 'pushData';
      }
    }

    return (
      <Checklist
        checklistItems={this.getChecklistItems()}
        closeSweetAlert={closeSweetAlert}
        delayChecklistHistory={delayChecklistHistory}
        dialogContent={getDialogContent}
        dialogTitle={dialogTitle}
        failedRules={failedRules}
        groupName={groupName}
        handleClearSubTask={isConfirmed => this.handleSubTaskClearance(isConfirmed)}
        handleDeleteTask={handleDeleteTask}
        handleShowDeleteTaskConfirmation={handleShowDeleteTaskConfirmation}
        incomeCalcInProgress={incomeCalcInProgress}
        isDialogOpen={isDialogOpen}
        location={location}
        onChange={onChecklistChange}
        onCompleteMyReviewClick={this.handleClose}
        passedRules={passedRules}
        putComputeRulesPassed={putComputeRulesPassed}
        resolutionData={resolutionData}
        resolutionId={resolutionId}
        ruleResultFromTaskTree={ruleResultFromTaskTree}
        selectedWidget={getSelectedWidget}
        styleName={styleName}
        taskName={taskName}
        title={checklistTitle}
        triggerHeader={isBookingWidgetOpen}
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

  renderWidgetComponents() {
    const { openWidgetList, groupName } = this.props;
    const mainWidget = R.head(openWidgetList);
    let widgetToRender = null;
    switch (mainWidget) {
      case ADDITIONAL_INFO:
        widgetToRender = <AdditionalInfo groupName={groupName} />;
        break;
      case HISTORY:
        widgetToRender = <MilestoneActivity />;
        break;
      case INCOME_CALCULATOR:
        widgetToRender = <IncomeCalcWidget />;
        break;
      default:
        widgetToRender = null;
    }
    return widgetToRender;
  }

  renderSweetAlert() {
    const { clearPopupData, popupData, dispatchAction } = this.props;
    if (popupData) {
      const {
        isOpen, message, title, level, showCancelButton,
        cancelButtonText, confirmButtonText, onConfirm,
      } = popupData;
      const confirmAction = onConfirm ? dispatchAction : clearPopupData;
      return (
        <Popup
          cancelButtonText={cancelButtonText}
          confirmButtonText={confirmButtonText}
          level={level}
          message={message}
          onCancel={clearPopupData}
          onConfirm={() => confirmAction(onConfirm)}
          show={isOpen}
          showCancelButton={showCancelButton}
          showConfirmButton
          title={title}
        />
      );
    }
    return null;
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
      openWidgetList,
      errorBanner,
      showBanner,
    } = this.props;
    const showDialogBox = (isAssigned && showDisposition);
    const bookingHomepageMsg = (isAssigned === true) ? 'Booking Widget' : 'Assign to me';
    if (isPostModEndShift) {
      history.push('/stager');
    }
    if (completeReviewResponse && !R.prop(ERROR, completeReviewResponse)) {
      history.push('/special-loan');
    }
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    if (noTasksFound || taskFetchError || isGetNextError) {
      return (
        this.renderTaskErrorMessage()
      );
    }

    const dispositionMessage = R.is(Array, disposition) ? R.join(',', disposition) : disposition;
    const taskPane = R.contains(INCOME_CALCULATOR, openWidgetList) ? null : <TaskPane styleName="tasks" />;
    const currentOverlay = this.shouldRenderWidgetView() ? null : (
      <>
        {taskPane}
        {this.renderChecklist()}
      </>
    );
    return (
      <div styleName="scroll-wrapper">
        { showBanner && <ErrorBanner errorBanner={errorBanner} /> }
        { R.contains(BOOKING, openWidgetList) && (
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
        {R.contains(ADDITIONAL_INFO, openWidgetList) && (
          <div styleName="bookingWidget">
            <span styleName="widgetTitle">
              ADDITIONAL INFO
            </span>
          </div>
        )
        }
        <section styleName={R.contains(HISTORY, openWidgetList) ? 'tasks-and-checklist-loan-audit' : 'tasks-and-checklist'}>
          {groupName === DashboardModel.BOOKING
          && !(R.contains(R.head(openWidgetList), [ADDITIONAL_INFO, HISTORY, BOOKING]))
            ? <BookingHomePage message={bookingHomepageMsg} />
            : currentOverlay }
          {this.renderSnackBar()}
          {!this.shouldRenderWidgetView() ? (
            <>
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
              <Navigation
                className={classNames(styles.footer, styles.navigation)}
                disableNext={disableNext}
                disablePrev={disablePrev}
                onNext={onNext}
                onPrev={onPrev}
              />
            </>
          ) : this.renderWidgetComponents()}
          <WidgetBuilder
            page={groupName}
            styleName={groupName === DashboardModel.DOCS_IN
              && R.contains(BOOKING, openWidgetList)
              ? 'task-checklist-bw' : 'task-checklist'}
          />
          {this.renderSweetAlert()}
        </section>
      </div>
    );
  }
}

TasksAndChecklist.defaultProps = {
  showBanner: false,
  enableGetNext: false,
  filter: null,
  inProgress: false,
  incomeCalcInProgress: false,
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
  ruleResultFromTaskTree: [],
  openWidgetList: [],
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
  checklistTitle: PropTypes.string.isRequired,
  clearPopupData: PropTypes.func.isRequired,
  closeSnackBar: PropTypes.func.isRequired,
  closeSweetAlert: PropTypes.func.isRequired,
  commentsRequired: PropTypes.bool.isRequired,
  completeReviewResponse: PropTypes.shape().isRequired,
  dataLoadStatus: PropTypes.string.isRequired,
  delayChecklistHistory: PropTypes.arrayOf(PropTypes.shape({
    completedByName: PropTypes.string,
    completedDate: PropTypes.string,
    delayChecklistReason: PropTypes.arrayOf(PropTypes.string),
    taskId: PropTypes.string,
  })).isRequired,
  dialogTitle: PropTypes.string,
  disableNext: PropTypes.bool.isRequired,
  disablePrev: PropTypes.bool.isRequired,
  dispatchAction: PropTypes.func.isRequired,
  disposition: PropTypes.oneOfType([
    PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  enableGetNext: PropTypes.bool,
  errorBanner: PropTypes.shape({
    errors: PropTypes.array,
    warnings: PropTypes.array,
  }).isRequired,
  failedRules: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filter: PropTypes.bool,
  getDialogContent: PropTypes.string,
  getSelectedWidget: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  handleClearSubTask: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  incomeCalcInProgress: PropTypes.bool,
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
  onWidgetToggle: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  passedRules: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  popupData: PropTypes.shape({
    cancelButtonText: PropTypes.string,
    clearData: PropTypes.string,
    confirmButtonText: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    showCancelButton: PropTypes.bool,
    showConfirmButton: PropTypes.bool,
    title: PropTypes.string,
  }).isRequired,
  putComputeRulesPassed: PropTypes.func.isRequired,
  resolutionData: PropTypes.arrayOf(PropTypes.string),
  resolutionId: PropTypes.string.isRequired,
  rootTaskId: PropTypes.string.isRequired,
  ruleResultFromTaskTree: PropTypes.arrayOf(PropTypes.shape),
  selectedTaskBlueprintCode: PropTypes.string.isRequired,
  selectedTaskId: PropTypes.string.isRequired,
  showAssign: PropTypes.bool,
  showBanner: PropTypes.bool,
  showDisposition: PropTypes.bool.isRequired,
  showInstructionsDialog: PropTypes.bool.isRequired,
  snackBarData: PropTypes.shape(),
  taskFetchError: PropTypes.bool,
  taskName: PropTypes.string.isRequired,
  user: PropTypes.shape({
    skills: PropTypes.array.isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

function getUserNotification(message) {
  if (message.type === SUCCESS) {
    return message;
  }
  if (message.type === ERROR) {
    return {
      type: ERROR,
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
    return MSG_TASK_FETCH_ERROR;
  }
  if (noTasksFound) {
    return MSG_NO_TASKS_FOUND;
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
    incomeCalcInProgress: incomeSelectors.inProgress(state),
    openWidgetList: widgetsSelectors.getOpenWidgetList(state),
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
    getSelectedWidget: dashboardSelectors.getSelectedWidget(state),
    passedRules: selectors.getPassedRules(state),
    failedRules: selectors.getFailedRules(state),
    filter: selectors.getFilter(state),
    resolutionId: selectors.getResolutionId(state),
    resolutionData: dashboardSelectors.getResolutionData(state),
    prevDocsInChecklistId: selectors.getPrevDocsInChecklistId(state),
    prevDocsInRootTaskId: selectors.getPrevDocsInRootTaskId(state),
    errorBanner: incomeSelectors.getErrorBanner(state),
    showBanner: dashboardSelectors.showBanner(state),
    ruleResultFromTaskTree: selectors.getRuleResultFromTaskTree(state),
    popupData: dashboardSelectors.getPopupData(state),
    loanNumber: dashboardSelectors.loanNumber(state),
    taskName: stagerSelectors.getTaskName(state),
    delayChecklistHistory: stagerSelectors.getDelayCheckListHistory(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onWidgetToggle: widgetsOperations.onWidgetToggle(dispatch),
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
    clearPopupData: dashboardOperations.clearPopupData(dispatch),
    putComputeRulesPassed: operations.putComputeRulesPassed(dispatch),
    dispatchAction: dashboardOperations.dispatchAction(dispatch),
  };
}

const TestHooks = {
  TasksAndChecklist,
  getUserNotification,
  getChecklistErrorMessage,
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TasksAndChecklist));

export { TestHooks };

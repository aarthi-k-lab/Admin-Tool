import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import classNames from 'classnames';
import TaskPane from 'containers/Dashboard/TaskPane';
import Checklist from 'components/Checklist';
import Loader from 'components/Loader/Loader';
import DashboardModel from 'models/Dashboard';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import UserNotification from 'components/UserNotification/UserNotification';
import DispositionModel from 'models/Disposition';
import ChecklistErrorMessageCodes from 'models/ChecklistErrorMessageCodes';
import CustomSnackBar from 'components/CustomSnackBar';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import Navigation from './Navigation';
import DialogCard from './DialogCard';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import styles from './TasksAndChecklist.css';

class TasksAndChecklist extends React.PureComponent {
  handleSubTaskClearance(isConfirmed) {
    if (isConfirmed) {
      const { handleClearSubTask } = this.props;
      const { selectedTaskId } = this.props;
      const { selectedTaskBlueprintCode } = this.props;
      handleClearSubTask(selectedTaskId, selectedTaskBlueprintCode);
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
    return (
      <Checklist
        checklistItems={checklistItems}
        dialogContent={getDialogContent}
        dialogTitle={dialogTitle}
        handleClearSubTask={isConfirmed => this.handleSubTaskClearance(isConfirmed)}
        handleDeleteTask={handleDeleteTask}
        handleShowDeleteTaskConfirmation={handleShowDeleteTaskConfirmation}
        isDialogOpen={isDialogOpen}
        onChange={onChecklistChange}
        styleName="checklist"
        title={checklistTitle}
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
      instructions,
      disableNext,
      disablePrev,
      disposition,
      inProgress,
      noTasksFound,
      onNext,
      onPrev,
      onInstuctionDialogToggle,
      showDisposition,
      showInstructionsDialog,
      taskFetchError,
      isTasksLimitExceeded,
    } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    if (noTasksFound || taskFetchError || isTasksLimitExceeded) {
      return this.renderTaskErrorMessage();
    }
    return (
      <div styleName="scroll-wrapper">
        <section styleName="tasks-and-checklist">
          <TaskPane styleName="tasks" />
          {this.renderChecklist()}
          {this.renderSnackBar()}
          <DialogCard
            dialogContent={instructions}
            dialogHeader="Steps to Resolve"
            message={disposition}
            onDialogToggle={onInstuctionDialogToggle}
            shouldShow={showDisposition}
            showDialog={showInstructionsDialog}
            styleName="instructions"
            title="Disposition"
          />
          <WidgetBuilder styleName="task-checklist" />
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

const RADIO_BUTTONS = 'radio';
const TEXT = 'text';
const MULTILINE_TEXT = 'multiline-text';
const NUMBER = 'number';
const DATE = 'date';

TasksAndChecklist.defaultProps = {
  enableGetNext: false,
  inProgress: false,
  message: null,
  noTasksFound: false,
  isTasksLimitExceeded: false,
  taskFetchError: false,
  isDialogOpen: false,
  dialogTitle: '',
  getDialogContent: '',
};

TasksAndChecklist.propTypes = {
  checklistErrorMessage: PropTypes.string.isRequired,
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      options: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf([RADIO_BUTTONS, TEXT, MULTILINE_TEXT, NUMBER, DATE]).isRequired,
    }),
  ).isRequired,
  checklistTitle: PropTypes.string.isRequired,
  closeSnackBar: PropTypes.func.isRequired,
  dataLoadStatus: PropTypes.string.isRequired,
  dialogTitle: PropTypes.string,
  disableNext: PropTypes.bool.isRequired,
  disablePrev: PropTypes.bool.isRequired,
  disposition: PropTypes.string.isRequired,
  enableGetNext: PropTypes.bool,
  getDialogContent: PropTypes.string,
  handleClearSubTask: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  inProgress: PropTypes.bool,
  instructions: PropTypes.string.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  isDialogOpen: PropTypes.bool,
  isTasksLimitExceeded: PropTypes.bool,
  message: PropTypes.string,
  noTasksFound: PropTypes.bool,
  onChecklistChange: PropTypes.func.isRequired,
  onInstuctionDialogToggle: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  selectedTaskBlueprintCode: PropTypes.string.isRequired,
  selectedTaskId: PropTypes.string.isRequired,
  showAssign: PropTypes.bool.isRequired,
  showDisposition: PropTypes.bool.isRequired,
  showInstructionsDialog: PropTypes.bool.isRequired,
  snackBarData: PropTypes.node.isRequired,
  taskFetchError: PropTypes.bool,
  user: PropTypes.shape({
    skills: PropTypes.objectOf(PropTypes.string).isRequired,
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
      msg: DispositionModel.getErrorMessages(message.data),
    };
  }
  return {
    type: 'do-not-display',
  };
}

function getChecklistErrorMessage(checklistErrorCode, taskFetchError,
  noTasksFound, isTasksLimitExceeded) {
  if ((!(taskFetchError || noTasksFound)) && !isTasksLimitExceeded) {
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
  if (isTasksLimitExceeded) {
    return 'You have reached the limit of 2 loans assigned at the same time. Please complete your review on one of them and try again.';
  }
  return '';
}

function mapStateToProps(state) {
  const noTasksFound = dashboardSelectors.noTasksFound(state);
  const taskFetchError = dashboardSelectors.taskFetchError(state);
  const checklistErrorCode = dashboardSelectors.getChecklistErrorCode(state);
  const isTasksLimitExceeded = dashboardSelectors.isTasksLimitExceeded(state);
  return {
    disposition: selectors.getDisposition(state),
    dataLoadStatus: selectors.getChecklistLoadStatus(state),
    checklistErrorMessage: getChecklistErrorMessage(
      checklistErrorCode,
      taskFetchError,
      noTasksFound,
      isTasksLimitExceeded,
    ),
    snackBarData: notificationSelectors.getSnackBarState(state),
    checklistItems: selectors.getChecklistItems(state),
    checklistTitle: selectors.getChecklistTitle(state),
    disableNext: selectors.shouldDisableNext(state),
    disablePrev: selectors.shouldDisablePrev(state),
    enableGetNext: dashboardSelectors.enableGetNext(state),
    isAssigned: dashboardSelectors.isAssigned(state),
    groupName: dashboardSelectors.groupName(state),
    inProgress: dashboardSelectors.inProgress(state),
    instructions: selectors.getInstructions(state),
    message: getUserNotification(dashboardSelectors.getChecklistDiscrepancies(state)),
    noTasksFound,
    isTasksLimitExceeded,
    showAssign: dashboardSelectors.showAssign(state),
    showDisposition: selectors.shouldShowDisposition(state),
    showInstructionsDialog: selectors.shouldShowInstructionsDialog(state),
    taskFetchError,
    user: loginSelectors.getUser(state),
    isDialogOpen: selectors.isDialogOpen(state),
    getDialogContent: selectors.getDialogContent(state),
    dialogTitle: selectors.getDialogTitle(state),
    selectedTaskId: selectors.selectedTaskId(state),
    selectedTaskBlueprintCode: selectors.selectedTaskBlueprintCode(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChecklistChange: operations.handleChecklistItemValueChange(dispatch),
    closeSnackBar: notificationOperations.closeSnackBar(dispatch),
    handleDeleteTask: operations.handleDeleteTask(dispatch),
    handleShowDeleteTaskConfirmation: operations.handleShowDeleteTaskConfirmation(dispatch),
    onNext: operations.fetchNextChecklist(dispatch),
    onPrev: operations.fetchPrevChecklist(dispatch),
    onInstuctionDialogToggle: operations.handleToggleInstructions(dispatch),
    handleClearSubTask: operations.handleSubTaskClearance(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksAndChecklist);

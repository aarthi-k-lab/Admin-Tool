import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import classNames from 'classnames';
import TaskPane from 'containers/Dashboard/TaskPane';
import Checklist from 'components/Checklist';
import Loader from 'components/Loader/Loader';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import { operations as dashboardOperations, selectors as dashboardSelectors } from 'ducks/dashboard';
import UserNotification from 'components/UserNotification/UserNotification';
import DispositionModel from 'models/Disposition';
import Navigation from './Navigation';
import DialogCard from './DialogCard';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import styles from './TasksAndChecklist.css';

class TasksAndChecklist extends React.PureComponent {
  validate() {
    const { groupName, validateDispositionTrigger, dispositionCode } = this.props;
    const payload = {
      dispositionReason: dispositionCode,
      group: groupName,
    };
    validateDispositionTrigger(payload);
  }

  renderTaskErrorMessage() {
    const { noTasksFound, taskFetchError } = this.props;
    const warningMessage = 'No tasks assigned.Please contact your manager';
    if (taskFetchError) {
      const errorMessage = 'Task Fetch Failed.Please try again Later';
      return (
        <div styleName="notificationMsg">
          <UserNotification
            level="error"
            message={errorMessage}
            type="alert-box"
          />
        </div>
      );
    }
    if (noTasksFound) {
      return (
        <div styleName="notificationMsg">
          <UserNotification
            level="error"
            message={warningMessage}
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
      notification = (
        <span styleName="notif">
          <UserNotification
            level={message.type}
            message={message.msg}
            type="alert-box"
          />
        </span>
      );
    }
    return (
      <Checklist
        checklistItems={checklistItems}
        onChange={onChecklistChange}
        styleName="checklist"
        title={checklistTitle}
      >
        {notification}
      </Checklist>
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
    } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    if (noTasksFound || taskFetchError) {
      return this.renderTaskErrorMessage();
    }
    return (
      <section styleName="tasks-and-checklist">
        <TaskPane styleName="tasks" />
        { this.renderChecklist() }
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
    );
  }
}

const RADIO_BUTTONS = 'radio';
const MULTILINE_TEXT = 'multiline-text';

TasksAndChecklist.defaultProps = {
  inProgress: false,
  message: null,
  noTasksFound: false,
  taskFetchError: false,
};

TasksAndChecklist.propTypes = {
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      options: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf([RADIO_BUTTONS, MULTILINE_TEXT]).isRequired,
    }),
  ).isRequired,
  checklistTitle: PropTypes.string.isRequired,
  dataLoadStatus: PropTypes.string.isRequired,
  disableNext: PropTypes.bool.isRequired,
  disablePrev: PropTypes.bool.isRequired,
  disposition: PropTypes.string.isRequired,
  dispositionCode: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  inProgress: PropTypes.bool,
  instructions: PropTypes.string.isRequired,
  message: PropTypes.string,
  noTasksFound: PropTypes.bool,
  onChecklistChange: PropTypes.func.isRequired,
  onInstuctionDialogToggle: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  showDisposition: PropTypes.bool.isRequired,
  showInstructionsDialog: PropTypes.bool.isRequired,
  taskFetchError: PropTypes.bool,
  validateDispositionTrigger: PropTypes.func.isRequired,
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

function mapStateToProps(state) {
  return {
    disposition: selectors.getDisposition(state),
    dispositionCode: selectors.getDispositionCode(state),
    dataLoadStatus: selectors.getChecklistLoadStatus(state),
    checklistItems: selectors.getChecklistItems(state),
    checklistTitle: selectors.getChecklistTitle(state),
    disableNext: selectors.shouldDisableNext(state),
    disablePrev: selectors.shouldDisablePrev(state),
    groupName: dashboardSelectors.groupName(state),
    inProgress: dashboardSelectors.inProgress(state),
    instructions: selectors.getInstructions(state),
    message: getUserNotification(dashboardSelectors.getChecklistDiscrepancies(state)),
    noTasksFound: dashboardSelectors.noTasksFound(state),
    showDisposition: selectors.shouldShowDisposition(state),
    showInstructionsDialog: selectors.shouldShowInstructionsDialog(state),
    taskFetchError: dashboardSelectors.taskFetchError(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChecklistChange: operations.handleChecklistItemValueChange(dispatch),
    validateDispositionTrigger: dashboardOperations.validateDispositionTrigger(dispatch),
    onNext: operations.fetchNextChecklist(dispatch),
    onPrev: operations.fetchPrevChecklist(dispatch),
    onInstuctionDialogToggle: operations.handleToggleInstructions(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksAndChecklist);

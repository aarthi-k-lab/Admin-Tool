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
    return (
      <Checklist
        checklistItems={checklistItems}
        onChange={onChecklistChange}
        styleName="checklist"
        title={checklistTitle}
      >
        {message && message.length ? (
          <span styleName="notif">
            <UserNotification
              level="error"
              message={message}
              type="alert-box"
            />
          </span>
        ) : null}
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
      onNext,
      onPrev,
      onInstuctionDialogToggle,
      showDisposition,
      showInstructionsDialog,
    } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
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
  onChecklistChange: PropTypes.func.isRequired,
  onInstuctionDialogToggle: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  showDisposition: PropTypes.bool.isRequired,
  showInstructionsDialog: PropTypes.bool.isRequired,
  validateDispositionTrigger: PropTypes.func.isRequired,
};

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
    message: DispositionModel.getErrorMessages(
      dashboardSelectors.getChecklistDiscrepancies(state),
    ),
    showDisposition: selectors.shouldShowDisposition(state),
    showInstructionsDialog: selectors.shouldShowInstructionsDialog(state),
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

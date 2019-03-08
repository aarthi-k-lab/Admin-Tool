import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import classNames from 'classnames';
import TaskPane from 'containers/Dashboard/TaskPane';
import Checklist from 'components/Checklist';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import Controls from './Controls';
import Navigation from './Navigation';
import DialogCard from './DialogCard';
import styles from './TasksAndChecklist.css';

class TasksAndChecklist extends React.PureComponent {
  renderChecklist() {
    const {
      checklistItems,
      checklistTitle,
      dataLoadStatus,
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
      />
    );
  }

  render() {
    const {
      disableNext,
      disablePrev,
      onNext,
      onPrev,
      onInstuctionDialogToggle,
      showInstructions,
      showInstructionsDialog,
    } = this.props;
    return (
      <section styleName="tasks-and-checklist">
        <TaskPane styleName="tasks" />
        { this.renderChecklist() }
        <DialogCard
          message="Missing Documents"
          onDialogToggle={onInstuctionDialogToggle}
          shouldShow={showInstructions}
          showDialog={showInstructionsDialog}
          styleName="instructions"
          title="Disposition"
        />
        <Controls
          className={classNames(styles.footer, styles.controls)}
        />
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
  onChecklistChange: PropTypes.func.isRequired,
  onInstuctionDialogToggle: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  showInstructions: PropTypes.bool.isRequired,
  showInstructionsDialog: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    dataLoadStatus: selectors.getChecklistLoadStatus(state),
    checklistItems: selectors.getChecklistItems(state),
    checklistTitle: selectors.getChecklistTitle(state),
    disableNext: selectors.shouldDisableNext(state),
    disablePrev: selectors.shouldDisablePrev(state),
    showInstructions: selectors.shouldShowInstructions(state),
    showInstructionsDialog: selectors.shouldShowInstructionsDialog(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChecklistChange: operations.handleChecklistItemValueChange(dispatch),
    onNext: operations.fetchNextChecklist(dispatch),
    onPrev: operations.fetchPrevChecklist(dispatch),
    onInstuctionDialogToggle: operations.handleToggleInstructions(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksAndChecklist);

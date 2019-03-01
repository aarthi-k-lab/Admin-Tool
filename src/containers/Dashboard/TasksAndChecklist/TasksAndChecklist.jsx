import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import TaskPane from 'containers/Dashboard/TaskPane';
import Checklist from 'components/Checklist';
import { selectors } from 'ducks/tasks-and-checklist';
import './TasksAndChecklist.css';

class TasksAndChecklist extends React.PureComponent {
  renderChecklist() {
    const {
      checklistItems,
      checklistTitle,
      dataLoadStatus,
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
        styleName="checklist"
        title={checklistTitle}
      />
    );
  }

  render() {
    return (
      <>
        <TaskPane />
        { this.renderChecklist() }
      </>
    );
  }
}

const RADIO_BUTTONS = 'radio';
const MULTILINE_TEXT = 'multiline-text';

TasksAndChecklist.propTypes = {
  checklistItems: PropTypes.arrayOf(
    PropTypes.shape({
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
};

function mapStateToProps(state) {
  return {
    dataLoadStatus: selectors.getChecklistLoadStatus(state),
    checklistItems: selectors.getChecklistItems(state),
    checklistTitle: selectors.getChecklistTitle(state),
  };
}

export default connect(mapStateToProps, null)(TasksAndChecklist);

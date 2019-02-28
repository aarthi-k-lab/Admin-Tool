import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TaskPane from 'containers/Dashboard/TaskPane';
import Checklist from 'components/Checklist';
import { selectors } from 'ducks/tasks-and-checklist';
import './TasksAndChecklist.css';

class TasksAndChecklist extends React.PureComponent {
  render() {
    const {
      checklistItems,
      checklistTitle,
    } = this.props;
    return (
      <>
        <TaskPane />
        <Checklist
          checklistItems={checklistItems}
          styleName="checklist"
          title={checklistTitle}
        />
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
};

function mapStateToProps(state) {
  return {
    checklistItems: selectors.getChecklistItems(state),
    checklistTitle: selectors.getChecklistTitle(state),
  };
}

export default connect(mapStateToProps, null)(TasksAndChecklist);

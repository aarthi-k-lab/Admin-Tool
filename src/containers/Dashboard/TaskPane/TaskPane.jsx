import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from 'ducks/config';
import { operations as taskOperations, selectors as taskSelectors } from 'ducks/feuw-tasks-and-checklist';
import LeftTaskPane from 'components/LeftTaskPane';
import TaskModel from 'lib/PropertyValidation/TaskModel';

class TaskPane extends React.PureComponent {
  componentDidMount() {
    const { getTasks } = this.props;
    getTasks();
  }

  render() {
    const {
      isAccessible,
      onSubTaskClick,
      tasks,
    } = this.props;
    return (
      isAccessible
        ? <LeftTaskPane onSubTaskClick={onSubTaskClick} tasks={tasks} />
        : null
    );
  }
}

const TestHooks = {
  TaskPane,
};

TaskPane.defaultProps = {
  isAccessible: false,
  tasks: [],
};

TaskPane.propTypes = {
  getTasks: PropTypes.func.isRequired,
  isAccessible: PropTypes.bool,
  onSubTaskClick: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(TaskModel),
};

const mapStateToProps = state => ({
  isAccessible: selectors.isTaskPaneAccessible(state),
  tasks: taskSelectors.getTaskTree(state).subTasks,
});

const mapDispatchToProps = dispatch => ({
  getTasks: taskOperations.fetchTasks(dispatch),
  onSubTaskClick: taskOperations.fetchChecklist(dispatch),
});

const TaskPaneContainer = connect(mapStateToProps, mapDispatchToProps)(TaskPane);

export default TaskPaneContainer;
export { TestHooks };

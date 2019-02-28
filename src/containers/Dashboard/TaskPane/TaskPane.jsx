import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from 'ducks/config';
import { operations as taskOperations, selectors as taskSelectors } from 'ducks/tasks-and-checklist';
import LeftTaskPane from 'components/LeftTaskPane';
import TaskModel from 'lib/PropertyValidation/TaskModel';

class TaskPane extends React.PureComponent {
  componentDidMount() {
    const { getTasks } = this.props;
    getTasks();
  }

  render() {
    const {
      onSubTaskClick,
      tasks,
    } = this.props;
    return (
      <LeftTaskPane onSubTaskClick={onSubTaskClick} tasks={tasks} />
    );
  }
}

const TestHooks = {
  TaskPane,
};

TaskPane.defaultProps = {
  tasks: [],
};

TaskPane.propTypes = {
  getTasks: PropTypes.func.isRequired,
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

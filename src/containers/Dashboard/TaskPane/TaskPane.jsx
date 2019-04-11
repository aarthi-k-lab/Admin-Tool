import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from 'ducks/config';
import { operations as taskOperations, selectors as taskSelectors } from 'ducks/tasks-and-checklist';
import LeftTaskPane from 'components/LeftTaskPane';
import OptionalTaskDetails from 'components/Tasks/OptionalTaskDetails';
import TaskModel from 'lib/PropertyValidation/TaskModel';

class TaskPane extends React.PureComponent {
  render() {
    const {
      className,
      dataLoadStatus,
      onSubTaskClick,
      selectedTaskId,
      storeTaskFilter,
      tasks,
      showOptionalTasks,
      onAddTaskClick,
    } = this.props;
    return (
      showOptionalTasks ? <OptionalTaskDetails onAddTaskClick={onAddTaskClick} tasks={[]} /> : (
        <LeftTaskPane
          className={className}
          dataLoadStatus={dataLoadStatus}
          onAddTaskClick={onAddTaskClick}
          onSubTaskClick={onSubTaskClick}
          selectedTaskId={selectedTaskId}
          storeTaskFilter={storeTaskFilter}
          tasks={tasks}
        />
      )
    );
  }
}

const TestHooks = {
  TaskPane,
};

TaskPane.defaultProps = {
  className: '',
  tasks: [],
};

TaskPane.propTypes = {
  className: PropTypes.string,
  dataLoadStatus: PropTypes.string.isRequired,
  onAddTaskClick: PropTypes.func.isRequired,
  onSubTaskClick: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string.isRequired,
  showOptionalTasks: PropTypes.bool.isRequired,
  storeTaskFilter: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(TaskModel),
};

const mapStateToProps = state => ({
  dataLoadStatus: taskSelectors.getTaskLoadStatus(state),
  isAccessible: selectors.isTaskPaneAccessible(state),
  selectedTaskId: taskSelectors.getSelectedChecklistId(state),
  tasks: taskSelectors.getTaskTree(state).subTasks,
  showOptionalTasks: taskSelectors.shouldShowOptionalTasks(state),
});

const mapDispatchToProps = dispatch => ({
  onSubTaskClick: taskOperations.fetchChecklist(dispatch),
  storeTaskFilter: taskOperations.saveTaskFilter(dispatch),
  onAddTaskClick: taskOperations.handleShowOptionalTasks(dispatch),
});

const TaskPaneContainer = connect(mapStateToProps, mapDispatchToProps)(TaskPane);

export default TaskPaneContainer;
export { TestHooks };

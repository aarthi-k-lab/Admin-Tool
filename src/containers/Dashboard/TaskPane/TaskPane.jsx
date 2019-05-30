import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from 'ducks/config';
import { operations as taskOperations, selectors as taskSelectors } from 'ducks/tasks-and-checklist';
import LeftTaskPane from 'components/LeftTaskPane';
import TaskModel from 'lib/PropertyValidation/TaskModel';
import OptionalTaskModel from 'lib/PropertyValidation/OptionalTaskModel';

// const tasks = [
//   {
//     _id: '5cae43fc180a3f35cd74115f',
//     assignedTo: [],
//     state: 'in-progress',
//     failureReason: '',
//     taskBlueprint: {
//       _id: '5c9ba78b3302b6f86c877b95',
//       effectiveEndDate: '9999-12-31T23:59:59.999Z',
//       name: 'Reject Review',
//       description: 'Reject Review',
//       taskCode: 'REJRV',
//       appCode: 'CMOD',
//       effectiveStartDate: '2019-03-27T16:40:42.282Z',
//       __v: 0,
//     },
//     createdDate: '2019-04-10T19:29:00.479Z',
//     appCode: 'CMOD',
//     __v: 0,
//     dependencyType: 'required',
//     order: 8,
//     visibility: true,
//     subTasks: [
//       {
//         _id: '5cae43fc180a3f4ec6741178',
//         assignedTo: [],
//         state: 'in-progress',
//         failureReason: '',
//         taskBlueprint: {
//           _id: '5c9ba78b3302b601ef877b98',
//           effectiveEndDate: '9999-12-31T23:59:59.999Z',
//           name: 'Reject Review',
//           description: 'Reject Review',
//           taskCode: 'REJRVW',
//           appCode: 'CMOD',
//           effectiveStartDate: '2019-03-27T16:40:42.282Z',
//           __v: 0,
//         },
//         createdDate: '2019-04-10T19:29:00.578Z',
//         appCode: 'CMOD',
//         __v: 0,
//         dependencyType: 'required',
//         order: 0,
//         visibility: true,
//       },
//     ],
//   },
//   {
//     _id: '5cae43fc180a3f2701741160',
//     assignedTo: [],
//     state: 'in-progress',
//     failureReason: '',
//     taskBlueprint: {
//       _id: '5c9ba78b3302b6e187877b9a',
//       effectiveEndDate: '9999-12-31T23:59:59.999Z',
//       name: 'Miscellaneous',
//       description: 'Miscellaneous',
//       taskCode: 'MISC',
//       appCode: 'CMOD',
//       effectiveStartDate: '2019-03-27T16:40:42.282Z',
//       __v: 0,
//     },
//     createdDate: '2019-04-10T19:29:00.481Z',
//     appCode: 'CMOD',
//     __v: 0,
//     dependencyType: 'required',
//     order: 9,
//     visibility: true,
//     subTasks: [
//       {
//         _id: '5cae43fc180a3f867b74117a',
//         assignedTo: [],
//         state: 'in-progress',
//         failureReason: '',
//         taskBlueprint: {
//           _id: '5c9ba78b3302b69f8b877ba5',
//           effectiveEndDate: '9999-12-31T23:59:59.999Z',
//           name: 'Miscellaneous',
//           description: 'Miscellaneous',
//           taskCode: 'MISCTSK',
//           appCode: 'CMOD',
//           effectiveStartDate: '2019-03-27T16:40:42.282Z',
//           __v: 0,
//         },
//         createdDate: '2019-04-10T19:29:00.587Z',
//         appCode: 'CMOD',
//         __v: 0,
//         dependencyType: 'required',
//         order: 0,
//         visibility: true,
//       },
//     ],
//   },
// ];

class TaskPane extends React.PureComponent {
  render() {
    const {
      className,
      dataLoadStatus,
      onSubTaskClick,
      selectedTaskId,
      storeTaskFilter,
      tasks,
      optionalTasks,
      shouldDeleteTask,
      showOptionalTasks,
      handleShowOptionalTasks,
      updateChecklist,
      handleShowDeleteTaskConfirmation,
      resetDeleteTaskConfirmation,
      fetchHistoricalCheckList,
    } = this.props;
    return (
      (
        <LeftTaskPane
          className={className}
          dataLoadStatus={dataLoadStatus}
          getHistoricalCheckList={fetchHistoricalCheckList}
          handleShowDeleteTaskConfirmation={handleShowDeleteTaskConfirmation}
          handleShowOptionalTasks={handleShowOptionalTasks}
          onSubTaskClick={onSubTaskClick}
          optionalTasks={optionalTasks}
          resetDeleteTaskConfirmation={resetDeleteTaskConfirmation}
          selectedTaskId={selectedTaskId}
          shouldDeleteTask={shouldDeleteTask}
          showOptionalTasks={showOptionalTasks}
          storeTaskFilter={storeTaskFilter}
          tasks={tasks}
          updateChecklist={updateChecklist}
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
  optionalTasks: [],
};

TaskPane.propTypes = {
  className: PropTypes.string,
  dataLoadStatus: PropTypes.string.isRequired,
  fetchHistoricalCheckList: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  handleShowOptionalTasks: PropTypes.func.isRequired,
  onSubTaskClick: PropTypes.func.isRequired,
  optionalTasks: PropTypes.arrayOf(OptionalTaskModel),
  resetDeleteTaskConfirmation: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string.isRequired,
  shouldDeleteTask: PropTypes.bool.isRequired,
  showOptionalTasks: PropTypes.bool.isRequired,
  storeTaskFilter: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(TaskModel),
  updateChecklist: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  dataLoadStatus: taskSelectors.getTaskLoadStatus(state),
  isAccessible: selectors.isTaskPaneAccessible(state),
  selectedTaskId: taskSelectors.getSelectedChecklistId(state),
  tasks: taskSelectors.getTaskTree(state).subTasks,
  optionalTasks: taskSelectors.getOptionalTasks(state),
  showOptionalTasks: taskSelectors.shouldShowOptionalTasks(state),
  shouldDeleteTask: taskSelectors.shouldDeleteTask(state),
});

const mapDispatchToProps = dispatch => ({
  onSubTaskClick: taskOperations.fetchChecklist(dispatch),
  storeTaskFilter: taskOperations.saveTaskFilter(dispatch),
  handleShowOptionalTasks: taskOperations.handleShowOptionalTasks(dispatch),
  handleShowDeleteTaskConfirmation: taskOperations.handleShowDeleteTaskConfirmation(dispatch),
  updateChecklist: taskOperations.handleUpdateChecklist(dispatch),
  fetchHistoricalCheckList: taskOperations.fetchHistoricalCheckList(dispatch),
  resetDeleteTaskConfirmation: taskOperations.resetDeleteTaskConfirmationValues(dispatch),
});

const TaskPaneContainer = connect(mapStateToProps, mapDispatchToProps)(TaskPane);

export default TaskPaneContainer;
export { TestHooks };

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { operations as configOperations, selectors } from 'ducks/config';
import { operations as taskOperations, selectors as taskSelectors } from 'ducks/tasks-and-checklist';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import LeftTaskPane from 'components/LeftTaskPane';
import TaskModel from 'lib/PropertyValidation/TaskModel';
import OptionalTaskModel from 'lib/PropertyValidation/OptionalTaskModel';

class TaskPane extends React.PureComponent {
  componentDidMount() {
    const { fetchPdfGeneratorUrl } = this.props;
    fetchPdfGeneratorUrl();
  }

  render() {
    const {
      className,
      dataLoadStatus,
      isAssigned,
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
      historicalCheckListData,
      pdfGeneratorConstant,
      pdfExportPayload,
    } = this.props;
    return (
      (
        <LeftTaskPane
          className={className}
          dataLoadStatus={dataLoadStatus}
          disableModifyOptionalTasks={!isAssigned}
          handleShowDeleteTaskConfirmation={handleShowDeleteTaskConfirmation}
          handleShowOptionalTasks={handleShowOptionalTasks}
          historicalCheckListData={historicalCheckListData}
          onSubTaskClick={onSubTaskClick}
          optionalTasks={optionalTasks}
          pdfExportPayload={pdfExportPayload}
          pdfGeneratorConstant={pdfGeneratorConstant}
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
  fetchPdfGeneratorUrl: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  handleShowOptionalTasks: PropTypes.func.isRequired,
  historicalCheckListData: PropTypes.arrayOf(PropTypes.shape({
    taskCheckListDateTime: PropTypes.string.isRequired,
    taskCheckListTemplateName: PropTypes.string.isRequired,
  })).isRequired,
  isAssigned: PropTypes.bool.isRequired,
  onSubTaskClick: PropTypes.func.isRequired,
  optionalTasks: PropTypes.arrayOf(PropTypes.shape(OptionalTaskModel)),
  pdfExportPayload: PropTypes.shape.isRequired,
  pdfGeneratorConstant: PropTypes.string.isRequired,
  resetDeleteTaskConfirmation: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string.isRequired,
  shouldDeleteTask: PropTypes.bool.isRequired,
  showOptionalTasks: PropTypes.bool.isRequired,
  storeTaskFilter: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape(TaskModel)),
  updateChecklist: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  dataLoadStatus: taskSelectors.getTaskLoadStatus(state),
  isAccessible: selectors.isTaskPaneAccessible(state),
  selectedTaskId: taskSelectors.getSelectedChecklistId(state),
  tasks: taskSelectors.getTaskTree(state).subTasks,
  optionalTasks: taskSelectors.getOptionalTasks(state),
  historicalCheckListData: taskSelectors.getHistoricalChecklistData(state),
  showOptionalTasks: taskSelectors.shouldShowOptionalTasks(state),
  shouldDeleteTask: taskSelectors.shouldDeleteTask(state),
  isAssigned: dashboardSelectors.isAssigned(state),
  pdfGeneratorConstant: selectors.pdfUrlConstants(state),
  pdfExportPayload: taskSelectors.getPDFExportPayload(state),
});

const mapDispatchToProps = dispatch => ({
  onSubTaskClick: taskOperations.fetchChecklist(dispatch),
  storeTaskFilter: taskOperations.saveTaskFilter(dispatch),
  handleShowOptionalTasks: taskOperations.handleShowOptionalTasks(dispatch),
  handleShowDeleteTaskConfirmation: taskOperations.handleShowDeleteTaskConfirmation(dispatch),
  updateChecklist: taskOperations.handleUpdateChecklist(dispatch),
  resetDeleteTaskConfirmation: taskOperations.resetDeleteTaskConfirmationValues(dispatch),
  fetchPdfGeneratorUrl: configOperations.fetchPdfGeneratorUrl(dispatch),
});

const TaskPaneContainer = connect(mapStateToProps, mapDispatchToProps)(TaskPane);

export default TaskPaneContainer;
export { TestHooks };

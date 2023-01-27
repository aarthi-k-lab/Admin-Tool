import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import ErrorIcon from '@material-ui/icons/Error';
import classNames from 'classnames';
import LeftParentTasks from 'components/Tasks/LeftParentTasks';
import TaskModel from 'lib/PropertyValidation/TaskModel';
import OptionalTaskModel from 'lib/PropertyValidation/OptionalTaskModel';
import OptionalTaskDetails from '../Tasks/OptionalTask/OptionalTaskDetails';
import styles from './LeftTaskPane.css';
import AddTask from '../Tasks/OptionalTask/AddTask';
import ChecklistHistory from '../Checklist/ChecklistHistory';
import ExportCurrentChecklist from '../Checklist/ExportCurrentChecklist';

const ALL = 'All Status';
const PENDING = 'Pending';
const COMPLETED = 'Completed';
const OPEN = 'open';
const statusMap = {
  All: '',
  Pending: 'in-progress',
  Completed: 'completed',
};

function StatusMenu({ onChange, taskStatus }) {
  return (
    <span styleName="status-select-field-span">
      <TextField
        className="status-select-field"
        id="status-selector"
        InputProps={{
          classes: {
            input: 'status-select-field-text',
          },
          disableUnderline: true,
        }}
        onChange={onChange}
        select
        value={taskStatus}
      >
        <MenuItem value={ALL}>{ALL}</MenuItem>
        <MenuItem value={PENDING}>{PENDING}</MenuItem>
        <MenuItem value={COMPLETED}>{COMPLETED}</MenuItem>
      </TextField>
    </span>
  );
}


function shouldShowAddTaskButton(optionalTasks) {
  return optionalTasks.length > 0;
}

StatusMenu.defaultProps = {
  onChange: () => { },
  taskStatus: ALL,
};

StatusMenu.propTypes = {
  onChange: PropTypes.func,
  taskStatus: PropTypes.string,
};

class LeftTaskPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksStatus: ALL,
      width: props.openWidth,
      isCollapsed: props.defaultState !== OPEN,
    };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  handleStatusChange(event) {
    const { storeTaskFilter } = this.props;
    const selectedStatus = event.target.value;
    this.setState({
      tasksStatus: selectedStatus,
    });
    storeTaskFilter(statusMap[selectedStatus]);
  }

  renderContent() {
    const { tasksStatus, isCollapsed } = this.state;
    const {
      dataLoadStatus,
      disableModifyOptionalTasks,
      pdfExportPayload,
      handleShowOptionalTasks,
      onSubTaskClick,
      resetDeleteTaskConfirmation,
      selectedTaskId,
      optionalTasks,
      tasks,
      updateChecklist,
      handleShowDeleteTaskConfirmation, shouldDeleteTask,
      historicalCheckListData,
      pdfGeneratorConstant,
      showExportChecklist,
      groupName,
      toggleWidget,
    } = this.props;
    if (dataLoadStatus === 'failed') {
      return (
        <ErrorIcon fontSize="large" styleName="error-indicator" />
      );
    }
    return (
      <>
        <div styleName="task-pane-controls">
          <StatusMenu
            onChange={this.handleStatusChange}
            taskStatus={tasksStatus}
          />
          <div styleName="icons">
            <div styleName="checklist-history-icon">
              <ChecklistHistory
                checkListData={historicalCheckListData}
                groupName={groupName}
                margin={{ marginLeft: '4rem' }}
                pdfExportPayload={pdfExportPayload}
                pdfGeneratorConstant={pdfGeneratorConstant}
                toggleWidget={toggleWidget}
              />
              {
                        showExportChecklist && (
                        <ExportCurrentChecklist
                          margin={{ marginLeft: '0.5rem' }}
                          pdfExportPayload={pdfExportPayload}
                          pdfGeneratorConstant={pdfGeneratorConstant}
                        />
                        )
                      }

            </div>
            {shouldShowAddTaskButton(optionalTasks)
              ? (
                <AddTask
                  disabled={disableModifyOptionalTasks}
                  onClick={() => handleShowOptionalTasks()}
                />
              )
              : null
                    }
          </div>
        </div>
        <LeftParentTasks
          disabled={dataLoadStatus === 'loading'}
          disableModifyOptionalTasks={disableModifyOptionalTasks}
          handleShowDeleteTaskConfirmation={handleShowDeleteTaskConfirmation}
          handleShowOptionalTasks={handleShowOptionalTasks}
          isCollapsed={isCollapsed}
          onSubTaskClick={onSubTaskClick}
          optionalTasks={optionalTasks}
          resetDeleteTaskConfirmation={resetDeleteTaskConfirmation}
          selectedTaskId={selectedTaskId}
          shouldDeleteTask={shouldDeleteTask}
          tasks={tasks}
          updateChecklist={updateChecklist}
        />
      </>
    );
  }


  render() {
    const { width } = this.state;
    const {
      className, handleShowOptionalTasks, optionalTasks, showOptionalTasks, updateChecklist,
      handleShowDeleteTaskConfirmation, shouldDeleteTask, resetDeleteTaskConfirmation,
    } = this.props;

    return (
      <div className={classNames(className, styles['stretch-column'])}>
        <div
          id="cmod_taskpane"
          style={{ width }}
          styleName="taskpane"
        >
          {showOptionalTasks
            ? (
              <OptionalTaskDetails
                handleShowDeleteTaskConfirmation={handleShowDeleteTaskConfirmation}
                handleShowOptionalTasks={handleShowOptionalTasks}
                resetDeleteTaskConfirmation={resetDeleteTaskConfirmation}
                shouldDeleteTask={shouldDeleteTask}
                tasks={optionalTasks}
                updateChecklist={updateChecklist}
              />
            )
            : this.renderContent()}
        </div>
      </div>
    );
  }
}

LeftTaskPane.propTypes = {
  className: PropTypes.string,
  dataLoadStatus: PropTypes.string,
  defaultState: PropTypes.string,
  disableModifyOptionalTasks: PropTypes.bool.isRequired,
  groupName: PropTypes.string,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  handleShowOptionalTasks: PropTypes.func.isRequired,
  historicalCheckListData: PropTypes.arrayOf(PropTypes.shape({
    taskCheckListDateTime: PropTypes.string.isRequired,
    taskCheckListTemplateName: PropTypes.string.isRequired,
  })).isRequired,
  onSubTaskClick: PropTypes.func.isRequired,
  openWidth: PropTypes.string,
  optionalTasks: PropTypes.arrayOf(PropTypes.shape(OptionalTaskModel)),
  pdfExportPayload: PropTypes.shape().isRequired,
  pdfGeneratorConstant: PropTypes.string.isRequired,
  resetDeleteTaskConfirmation: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string,
  shouldDeleteTask: PropTypes.bool.isRequired,
  showExportChecklist: PropTypes.bool.isRequired,
  showOptionalTasks: PropTypes.bool.isRequired,
  storeTaskFilter: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape(TaskModel)).isRequired,
  toggleWidget: PropTypes.bool,
  updateChecklist: PropTypes.func.isRequired,
};

LeftTaskPane.defaultProps = {
  className: '',
  dataLoadStatus: 'completed',
  defaultState: 'open', // or 'closed'
  openWidth: '21rem',
  selectedTaskId: '',
  optionalTasks: [],
  groupName: '',
  toggleWidget: false,
};
export default (LeftTaskPane);

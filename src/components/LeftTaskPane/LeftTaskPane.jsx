import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import classNames from 'classnames';
import CollapseIcon from 'components/Tasks/CollapseIcon';
import LeftParentTasks from 'components/Tasks/LeftParentTasks';
import TaskModel from 'lib/PropertyValidation/TaskModel';
import OptionalTaskModel from 'lib/PropertyValidation/OptionalTaskModel';
import History from '@material-ui/icons/History';
// import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import OptionalTaskDetails from '../Tasks/OptionalTask/OptionalTaskDetails';
import styles from './LeftTaskPane.css';
import AddTask from '../Tasks/OptionalTask/AddTask';

const historicalData = [
  {
    checklistId: '5ce7143f69daeb6ed3ffdb4c',
    description: 'BEUW-Suspicious Activity Review',
    time: '27 May 2019 08:30pm',
  },
  {
    checklistId: '5ce7143f69daeb6ed3ffdb4c',
    description: 'BEUW-Suspicious Activity Review',
    time: '27 May 2019 08:30pm',
  },
  {
    checklistId: '5ce7143f69daeb6ed3ffdb4c',
    description: 'FEUW-Suspicious Activity Review',
    time: '27 May 2019 08:30pm',
  },
];

const ALL = 'All';
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
        label="Status"
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
  onChange: () => {},
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
      anchorEl: null,
      tasksStatus: ALL,
      width: props.defaultState === OPEN ? props.openWidth : props.closedWidth,
      isCollapsed: props.defaultState !== OPEN,
      // eslint-disable-next-line react/no-unused-state
      selectedHistoricalChecklist: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.checklistHistoryMenu = this.checklistHistoryMenu.bind(this);
    this.handleHistoricalCheclistClick = this.handleHistoricalCheclistClick.bind(this);
    this.handleChecklistOpen = this.handleChecklistOpen.bind(this);
  }

  handleStatusChange(event) {
    const { storeTaskFilter } = this.props;
    const selectedStatus = event.target.value;
    this.setState({
      tasksStatus: selectedStatus,
    });
    storeTaskFilter(statusMap[selectedStatus]);
  }

  handleHistoricalCheclistClick(checklistId) {
    const { getHistoricalCheckList } = this.props;
    console.log(checklistId);
    getHistoricalCheckList('5cee415e6dc1d4270a6a63e8');
    this.handleClose();
  }


  handleClick() {
    const { isCollapsed } = this.state;
    const { openWidth, closedWidth } = this.props;
    this.setState({
      width: isCollapsed ? openWidth : closedWidth,
      isCollapsed: !isCollapsed,
    });
  }


  handleClose() {
    this.setState({ anchorEl: null });
  }

  handleChecklistOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  checklistHistoryMenu() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <>
        <History onClick={this.handleChecklistOpen} styleName="task-pane-controls" />
        <Menu
          anchorEl={anchorEl}
          id="long-menu"
          onClose={value => this.handleClose(value)}
          open={open}
          PaperProps={{
            style: {
              // width: 200,
            },
          }}
        >
          {historicalData.map(option => (
            <a download href="http://127.0.0.1:7601/api/download/5cee415e6dc1d4270a6a63e8">
              <MenuItem onClick={() => this.handleHistoricalCheclistClick(option.checklistId)}>
                <div>
                  {option.description}
                  <br />
                  <span>
                    {option.time}
                  </span>
                </div>
              </MenuItem>
            </a>
          ))}
        </Menu>
      </>
    );
  }


  renderContent() {
    const { tasksStatus, isCollapsed } = this.state;
    const {
      dataLoadStatus,
      handleShowOptionalTasks,
      onSubTaskClick,
      resetDeleteTaskConfirmation,
      selectedTaskId,
      optionalTasks,
      tasks,
      updateChecklist,
      handleShowDeleteTaskConfirmation, shouldDeleteTask,
    } = this.props;
    if (dataLoadStatus === 'failed') {
      return (
        <ErrorIcon fontSize="large" styleName="error-indicator" />
      );
    }
    if (dataLoadStatus === 'loading') {
      return (
        <CircularProgress styleName="loader" />
      );
    }
    return (
      <>
        <div styleName={isCollapsed ? 'task-pane-controls task-pane-controls-collapsed' : 'task-pane-controls'}>
          {
            !isCollapsed
              ? (
                <>
                  <StatusMenu
                    onChange={this.handleStatusChange}
                    taskStatus={tasksStatus}
                  />
                  {this.checklistHistoryMenu()}
                  { shouldShowAddTaskButton(optionalTasks)
                    ? <AddTask onClick={() => handleShowOptionalTasks()} />
                    : <div />
                  }
                </>
              )
              : null
          }
          <span
            onClick={this.handleClick}
            onKeyPress={() => null}
            role="button"
            styleName={isCollapsed ? 'collapse-icon-closed' : 'collapse-icon-open'}
            tabIndex={0}
          >
            <CollapseIcon
              direction={isCollapsed ? 'right' : 'left'}
            />
          </span>
        </div>
        <LeftParentTasks
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
          { showOptionalTasks
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
            : this.renderContent() }
        </div>
      </div>
    );
  }
}

LeftTaskPane.propTypes = {
  className: PropTypes.string,
  closedWidth: PropTypes.string,
  dataLoadStatus: PropTypes.string,
  defaultState: PropTypes.string,
  getHistoricalCheckList: PropTypes.func.isRequired,
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  handleShowOptionalTasks: PropTypes.func.isRequired,
  onSubTaskClick: PropTypes.func.isRequired,
  openWidth: PropTypes.string,
  optionalTasks: PropTypes.arrayOf(OptionalTaskModel),
  resetDeleteTaskConfirmation: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string,
  shouldDeleteTask: PropTypes.bool.isRequired,
  showOptionalTasks: PropTypes.bool.isRequired,
  storeTaskFilter: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(TaskModel).isRequired,
  updateChecklist: PropTypes.func.isRequired,
};

LeftTaskPane.defaultProps = {
  className: '',
  closedWidth: '4rem',
  dataLoadStatus: 'completed',
  defaultState: 'open', // or 'closed'
  openWidth: '20rem',
  selectedTaskId: '',
  optionalTasks: [],
};

export default LeftTaskPane;

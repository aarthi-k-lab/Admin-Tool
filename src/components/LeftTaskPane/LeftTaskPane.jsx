import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import classNames from 'classnames';
import CollapseIcon from 'components/Tasks/CollapseIcon';
import LeftParentTasks from 'components/Tasks/LeftParentTasks';
import OptionalTaskDetails from 'components/Tasks/OptionalTaskDetails';
import TaskModel from 'lib/PropertyValidation/TaskModel';
import OptionalTaskModel from 'lib/PropertyValidation/OptionalTaskModel';
import styles from './LeftTaskPane.css';
import AddTask from './AddTask';

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
      tasksStatus: ALL,
      width: props.defaultState === OPEN ? props.openWidth : props.closedWidth,
      isCollapsed: props.defaultState !== OPEN,
    };
    this.handleClick = this.handleClick.bind(this);
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

  handleClick() {
    const { isCollapsed } = this.state;
    const { openWidth, closedWidth } = this.props;
    this.setState({
      width: isCollapsed ? openWidth : closedWidth,
      isCollapsed: !isCollapsed,
    });
  }


  renderContent() {
    const { tasksStatus, isCollapsed } = this.state;
    const {
      dataLoadStatus,
      onAddTaskClick,
      onSubTaskClick,
      selectedTaskId,
      optionalTasks,
      tasks,
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
                  { shouldShowAddTaskButton(optionalTasks)
                    ? <AddTask onClick={() => onAddTaskClick()} />
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
          isCollapsed={isCollapsed}
          onSubTaskClick={onSubTaskClick}
          selectedTaskId={selectedTaskId}
          tasks={tasks}
        />
      </>
    );
  }

  render() {
    const { width } = this.state;
    const {
      className, optionalTasks, showOptionalTasks, onAddTaskClick,
    } = this.props;

    return (
      <div className={classNames(className, styles['stretch-column'])}>
        <div
          id="cmod_taskpane"
          style={{ width }}
          styleName="taskpane"
        >
          { showOptionalTasks
            ? <OptionalTaskDetails onAddTaskClick={onAddTaskClick} tasks={optionalTasks} />
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
  onAddTaskClick: PropTypes.func.isRequired,
  onSubTaskClick: PropTypes.func.isRequired,
  openWidth: PropTypes.string,
  optionalTasks: PropTypes.arrayOf(OptionalTaskModel),
  selectedTaskId: PropTypes.string,
  showOptionalTasks: PropTypes.bool.isRequired,
  storeTaskFilter: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(TaskModel).isRequired,
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

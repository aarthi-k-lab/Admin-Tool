import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import './LeftTaskPane.css';
import CollapseIcon from 'components/Tasks/CollapseIcon';
import LeftParentTasks from 'components/Tasks/LeftParentTasks';
import TaskModel from 'lib/PropertyValidation/TaskModel';

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
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </TextField>
    </span>
  );
}

StatusMenu.defaultProps = {
  onChange: () => {},
  taskStatus: 'All',
};

StatusMenu.propTypes = {
  onChange: PropTypes.func,
  taskStatus: PropTypes.string,
};

class LeftTaskPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksStatus: 'All',
      width: props.defaultState === 'open' ? props.openWidth : props.closedWidth,
      isCollapsed: props.defaultState !== 'open',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  handleStatusChange(event) {
    this.setState({
      tasksStatus: event.target.value,
    });
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
    const { dataLoadStatus, onSubTaskClick, tasks } = this.props;
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
                <StatusMenu
                  onChange={this.handleStatusChange}
                  taskStatus={tasksStatus}
                />
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
          tasks={tasks}
        />
      </>
    );
  }

  render() {
    const { width } = this.state;
    return (
      <div styleName="stretch-column">
        <div
          id="cmod_taskpane"
          style={{ width }}
          styleName="taskpane"
        >
          { this.renderContent() }
        </div>
      </div>
    );
  }
}

LeftTaskPane.propTypes = {
  closedWidth: PropTypes.string,
  dataLoadStatus: PropTypes.string,
  defaultState: PropTypes.string,
  onSubTaskClick: PropTypes.func.isRequired,
  openWidth: PropTypes.string,
  tasks: PropTypes.arrayOf(TaskModel).isRequired,
};

LeftTaskPane.defaultProps = {
  closedWidth: '4rem',
  dataLoadStatus: 'completed',
  defaultState: 'open', // or 'closed'
  openWidth: '20rem',
};

export default LeftTaskPane;

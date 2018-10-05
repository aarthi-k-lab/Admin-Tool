import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import TaskStatusIcon from '../TaskStatusIcon';

import './LeftParentTasks.css';
// Integrate with service once ready.
import tasksObj from './constants/TaskConstants';

class LeftParentTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: tasksObj,
      tasksStatus: 'All',
    };
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
  }

  handleStatusChange(event) {
    this.setState({
      tasksStatus: event.target.value,
    });
  }

  static renderCollapsedView(task) {
    return (
      <Grid container spacing={10}>
        <Grid item>
          <span placement="right" title={task.taskName}>
            <TaskStatusIcon task={task} />
          </span>
        </Grid>
      </Grid>);
  }

  static renderTasksChecklist(task) {
    return (
      <span>
        <Grid container spacing={10} styleName="parent-task-grid-div">
          <Grid item>
            <TaskStatusIcon task={task} />
          </Grid>
          <Grid item xs={8}>
            <span styleName="parent-task-name">{ task.taskName }</span>
            <br />
            <span styleName="error-text-parent">{ task.errorName }</span>
          </Grid>
        </Grid>
        {
          task.subTasks && task.subTasks.length ? (
            <Grid container direction="column" spacing={6}>
              {task.subTasks.map(subTask => (
                <Grid container spacing={12} styleName="subtask-grid">
                  <Grid item xs={2} />
                  <Grid item xs={2}>
                    <TaskStatusIcon isSubTask task={subTask} />
                  </Grid>
                  <Grid item xs={8}>
                    <span styleName={subTask.failure ? 'failure-subtask-name' : 'subtask-name'}>{ subTask.taskName }</span>
                    <br />
                    <span styleName="error-text-subtask">{ subTask.errorName }</span>
                  </Grid>
                </Grid>))}
            </Grid>
          ) : null
        }
      </span>
    );
  }

  renderTasks(isCollapsed) {
    const { tasks } = this.state;
    return tasks.map((task, i) => (
      <div>
        {
        isCollapsed
          ? this.constructor.renderCollapsedView(task)
          : this.constructor.renderTasksChecklist(task, i)
        }
      </div>
    ));
  }

  render() {
    const { tasksStatus } = this.state;
    const { isCollapsed } = this.props;
    return (
      <div styleName="left-parent-tasks">
        {!isCollapsed ? (
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
              onChange={this.handleStatusChange}
              select
              value={tasksStatus}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </span>) : null}
        <div styleName="left-pane-tasks-main-div">
          {
            this.renderTasks(isCollapsed)
          }
        </div>

      </div>
    );
  }
}

LeftParentTasks.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

export default LeftParentTasks;

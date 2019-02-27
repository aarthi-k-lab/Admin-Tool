import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import TaskModel from 'lib/PropertyValidation/TaskModel';
import TaskStatusIcon from '../TaskStatusIcon';
import SubTask from './SubTask/SubTask';

import './LeftParentTasks.css';

class LeftParentTasks extends React.Component {
  constructor(props) {
    super(props);
    this.renderTasks = this.renderTasks.bind(this);
  }

  static renderCollapsedView(task) {
    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <span placement="right" title={R.pathOr('', ['taskBlueprint', 'name'], task)}>
            <TaskStatusIcon styleName="icon-padding" task={task} />
          </span>
        </Grid>
      </Grid>);
  }

  static renderTasksChecklist(task, onSubTaskClick) {
    return (
      <>
        <Grid container spacing={0} wrap="nowrap">
          <Grid alignItems="center" container item justify="center" xs={2}>
            <TaskStatusIcon styleName="fill-width" task={task} />
          </Grid>
          <Grid alignItems="center" container item xs={10}>
            <span styleName="parent-task-name">{ R.pathOr('', ['taskBlueprint', 'name'], task) }</span>
            {
              task.failureReason
                && (
                  <>
                    <br />
                    <span styleName="error-text-parent">{ task.failureReason }</span>
                  </>
                )
            }
          </Grid>
        </Grid>
        {
          task.subTasks && task.subTasks.length ? (
            <Grid container direction="column" spacing={6}>
              {task.subTasks.map(subTask => <SubTask data={subTask} onClick={onSubTaskClick} />)}
            </Grid>
          ) : null
        }
      </>
    );
  }

  renderTasks(isCollapsed) {
    const { tasks, onSubTaskClick } = this.props;
    return tasks.map(task => (
      <div styleName="task-group">
        {
        isCollapsed
          ? this.constructor.renderCollapsedView(task)
          : this.constructor.renderTasksChecklist(task, onSubTaskClick)
        }
      </div>
    ));
  }

  render() {
    const { isCollapsed } = this.props;
    return (
      <div styleName="left-pane-tasks-main-div">
        <div styleName="left-pane-scrollable-tasks">
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
  onSubTaskClick: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(TaskModel).isRequired,
};

export default LeftParentTasks;

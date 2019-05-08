import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import TaskModel from 'lib/PropertyValidation/TaskModel';
import TaskStatusIcon from '../TaskStatusIcon';
import SubTask from './SubTask/SubTask';
import DeleteTask from './OptionalTask/DeleteTask';
import styles from './LeftParentTasks.css';

class LeftParentTasks extends React.Component {
  constructor(props) {
    super(props);
    this.renderTasks = this.renderTasks.bind(this);
    const { optionalTasks } = this.props;
    this.state = {
      isTaskAdded: optionalTasks.map(task => task.visibility),
    };
    this.changedTask = {
      taskIdx: 0,
      task: {},
    };
  }

  componentDidUpdate(prevProps) {
    const { shouldDeleteTask, resetDeleteTaskConfirmation } = this.props;
    const { taskIdx, task } = this.changedTask;
    if (prevProps.shouldDeleteTask !== shouldDeleteTask) {
      if (shouldDeleteTask) {
        this.modifyTaskList(taskIdx, task);
        resetDeleteTaskConfirmation();
      }
    }
  }

  deleteTask(taskIdx, task) {
    this.changedTask = Object.assign({}, this.changedTask, { taskIdx, task });
    const { handleShowDeleteTaskConfirmation } = this.props;
    const payload = {
      deleteTaskConfirmationDialog: {
        title: 'DELETE TASK',
        isOpen: true,
        content: 'Deleting a task will delete all the associated checklist information. Do you like to proceed?',
      },
    };
    handleShowDeleteTaskConfirmation(payload);
  }

  modifyTaskList(taskIdx, task) {
    const { updateChecklist } = this.props;
    const { isTaskAdded } = this.state;
    const isTaskAddedList = isTaskAdded;
    isTaskAddedList[taskIdx] = !isTaskAddedList[taskIdx];
    this.setState({
      isTaskAdded: isTaskAddedList,
    });
    const payload = {
      task: Object.assign({}, task, { visibility: isTaskAdded[taskIdx] }),
      fieldName: 'visibility',
    };
    updateChecklist(payload);
  }

  renderDeleteIcon(task) {
    const { optionalTasks } = this.props;
    // eslint-disable-next-line no-underscore-dangle
    const index = optionalTasks.findIndex(optTask => optTask.id === task._id);
    if (index !== -1) {
      return (
        <DeleteTask
          disabled={false}
          margin={{ 'margin-right': '2.2rem' }}
          onClick={() => this.deleteTask(index, task)}
          toolTipPosition="left"
        />
      );
    }
    return null;
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

  renderTasksChecklist(task, selectedTaskId, onSubTaskClick) {
    const isTaskSelected = task.subTasks.some(({ _id: id }) => id === selectedTaskId);
    return (
      <>
        <Grid
          className={
            isTaskSelected
              ? styles['selected-task']
              : ''
          }
          container
          spacing={0}
          wrap="nowrap"
        >
          <Grid alignItems="center" container item justify="center" xs={2}>
            <TaskStatusIcon isSelected={isTaskSelected} styleName="fill-width" task={task} />
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
          <Grid alignItems="center" container item xs={2}>
            {this.renderDeleteIcon(task)}
          </Grid>
        </Grid>
        {
          task.subTasks && task.subTasks.length ? (
            <Grid container direction="column" spacing={6}>
              {
                task.subTasks
                  .filter(({ visibility }) => visibility)
                  .map(subTask => (
                    <SubTask
                      data={subTask}
                      onClick={onSubTaskClick}
                      selected={subTask._id === selectedTaskId} // eslint-disable-line
                    />
                  ))
              }
            </Grid>
          ) : null
        }
      </>
    );
  }

  renderTasks(isCollapsed) {
    const {
      tasks, onSubTaskClick, selectedTaskId,
    } = this.props;
    return (
      tasks
        .filter(({ visibility }) => visibility)
        .map(task => (
          <div styleName="task-group">
            {
            isCollapsed
              ? this.constructor.renderCollapsedView(task)
              : this.renderTasksChecklist(task,
                selectedTaskId, onSubTaskClick)
            }
          </div>
        ))
    );
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

LeftParentTasks.defaultProps = {
  selectedTaskId: '',
};

LeftParentTasks.propTypes = {
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onSubTaskClick: PropTypes.func.isRequired,
  optionalTasks: PropTypes.arrayOf(PropTypes.shape).isRequired,
  resetDeleteTaskConfirmation: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string,
  shouldDeleteTask: PropTypes.bool.isRequired,
  tasks: PropTypes.arrayOf(TaskModel).isRequired,
  updateChecklist: PropTypes.func.isRequired,
};

export default LeftParentTasks;

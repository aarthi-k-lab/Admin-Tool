/* eslint-disable no-underscore-dangle */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import TaskModel from 'lib/PropertyValidation/TaskModel';
import hotkeys from 'hotkeys-js';
import TaskStatusIcon from '../TaskStatusIcon';
import SubTask from './SubTask/SubTask';
import DeleteTask from './OptionalTask/DeleteTask';
import styles from './LeftParentTasks.css';

const SHIFT_DOWN_KEY = [16, 40];
const SHIFT_UP_KEY = [16, 38];
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

  componentDidMount() {
    hotkeys('*', (event) => {
      if (event.type === 'keydown') {
        this.handleHotKeyPress();
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { shouldDeleteTask, resetDeleteTaskConfirmation } = this.props;
    const { taskIdx, task } = this.changedTask;
    if (prevProps.shouldDeleteTask !== shouldDeleteTask) {
      if (shouldDeleteTask) {
        this.modifyTaskList(taskIdx, task, 'DELETE');
        resetDeleteTaskConfirmation();
      }
    }
  }

  componentWillUnmount() {
    hotkeys.unbind('*');
  }

  findLastItem= (tasks) => {
    let lastItem = 0;
    tasks.forEach((task, index) => {
      lastItem = task.visibility ? index : lastItem;
    });
    return lastItem;
  }

  handleHotKeyPress = () => {
    const { tasks, onSubTaskClick, selectedTaskId } = this.props;
    if (R.equals(hotkeys.getPressedKeyCodes(), SHIFT_DOWN_KEY)) {
      const subtaskOrder = this.findLastItem(tasks);
      const lastItem = this.findLastItem(tasks[subtaskOrder].subTasks);
      if (!R.equals(selectedTaskId, tasks[subtaskOrder].subTasks[lastItem]._id)) {
        onSubTaskClick(tasks[subtaskOrder].subTasks[lastItem]._id);
      }
    } else if (R.equals(hotkeys.getPressedKeyCodes(), SHIFT_UP_KEY)) {
      if (!R.equals(selectedTaskId, tasks[0].subTasks[0]._id)) {
        onSubTaskClick(tasks[0].subTasks[0]._id);
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

  modifyTaskList(taskIdx, task, type) {
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
      type,
    };
    updateChecklist(payload);
  }

  renderDeleteIcon(task) {
    const { disableModifyOptionalTasks, optionalTasks } = this.props;
    // eslint-disable-next-line no-underscore-dangle
    const index = optionalTasks.findIndex(optTask => optTask.id === task._id);
    if (index !== -1) {
      return (
        <DeleteTask
          disabled={disableModifyOptionalTasks}
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
      </Grid>
    );
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
            <Grid container direction="column" spacing={0}>
              {
                task.subTasks
                  .filter(({ visibility }) => visibility)
                  .map(subTask => (
                    <SubTask
                      key={subTask._id} // eslint-disable-line
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
          <div key={task._id} styleName="task-group">
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
  disableModifyOptionalTasks: false,
  selectedTaskId: '',
};

LeftParentTasks.propTypes = {
  disableModifyOptionalTasks: PropTypes.bool,
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

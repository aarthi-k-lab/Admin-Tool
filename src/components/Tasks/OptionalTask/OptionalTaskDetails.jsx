import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Grid from '@material-ui/core/Grid';
import AddTask from './AddTask';
import DeleteTask from './DeleteTask';
import Close from './Close';
import TaskStatusIcon from '../../TaskStatusIcon/TaskStatusIcon';
import './OptionalTaskDetails.css';

const ADD = 'ADD';
const DELETE = 'DELETE';

class OptionalTaskDetails extends React.Component {
  constructor(props) {
    super(props);
    const { tasks } = this.props;
    this.state = {
      isTaskAdded: tasks.map(task => task.visibility),
    };
    this.changedTask = {
      taskIdx: 0,
      task: {},
    };
  }

  static getDerivedStateFromProps(props, state) {
    const tasks = R.propOr([], 'tasks', props);

    if (tasks.length > 0) {
      const optTaskListFromProps = tasks.map(task => task.visibility);
      const isTaskAdded = R.propOr([], 'isTaskAdded', state);

      if (!R.equals(optTaskListFromProps, isTaskAdded)) {
        return ({
          isTaskAdded: optTaskListFromProps,
        });
      }
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const { shouldDeleteTask, resetDeleteTaskConfirmation } = this.props;
    const { taskIdx, task } = this.changedTask;
    if (prevProps.shouldDeleteTask !== shouldDeleteTask) {
      if (shouldDeleteTask) {
        this.modifyTaskList(taskIdx, task, DELETE);
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

  renderDeleteIcon(index, task) {
    return (
      <DeleteTask
        disabled={false}
        margin={{ 'margin-left': '4.2rem' }}
        onClick={() => this.deleteTask(index, task)}
        toolTipPosition="left"
      />
    );
  }

  render() {
    const { tasks, handleShowOptionalTasks } = this.props;
    const { isTaskAdded } = this.state;
    return (
      <>
        <header>
          <h3 styleName="optional-task-heading">ADD NEW TASK</h3>
        </header>
        {
            tasks.map((task, index) => (
              <Grid
                key={`Grid${task.name}`}
                container
                spacing={0}
                styleName="task-group"
                wrap="nowrap"
              >
                <Grid alignItems="center" container item justify="center" xs={2}>
                  <TaskStatusIcon styleName="fill-width" task={task} />
                </Grid>
                <Grid alignItems="center" container item xs={6}>
                  <span styleName="parent-task-name">{ R.prop('name', task) }</span>
                </Grid>
                <Grid alignItems="center" container item xs={2}>
                  {
                      isTaskAdded[index] ? this.renderDeleteIcon(index, task)
                        : (
                          <span>
                            <AddTask
                              disabled={false}
                              margin={{ 'margin-left': '3rem' }}
                              onClick={() => this.modifyTaskList(index, task, ADD)}
                              toolTipPosition="left"
                            />
                          </span>
                        )
                      }
                </Grid>
              </Grid>
            ))
          }
        <Close disabled={false} onClick={() => handleShowOptionalTasks()} />
      </>
    );
  }
}

OptionalTaskDetails.propTypes = {
  handleShowDeleteTaskConfirmation: PropTypes.func.isRequired,
  handleShowOptionalTasks: PropTypes.func.isRequired,
  resetDeleteTaskConfirmation: PropTypes.func.isRequired,
  shouldDeleteTask: PropTypes.bool.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape).isRequired,
  updateChecklist: PropTypes.func.isRequired,
};

export default OptionalTaskDetails;

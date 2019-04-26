import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Grid from '@material-ui/core/Grid';
import AddTask from '../LeftTaskPane/AddTask';
import DeleteTask from '../LeftTaskPane/DeleteTask';
import Close from '../LeftTaskPane/Close';
import TaskStatusIcon from '../TaskStatusIcon/TaskStatusIcon';
import './OptionalTaskDetails.css';

class OptionalTaskDetails extends React.Component {
  constructor(props) {
    super(props);
    const { tasks } = this.props;
    const isTaskAdded = new Array(tasks.length);
    this.state = {
      isTaskAdded: isTaskAdded.fill(false),
    };
  }

  onAddTask(index) {
    this.modifyTaskList(index);
  }

  onDeleteTask(task, index) {
    this.modifyTaskList(index);
  }

  modifyTaskList(taskIdx) {
    const { isTaskAdded } = this.state;
    const isTaskAddedList = isTaskAdded;
    isTaskAddedList[taskIdx] = !isTaskAddedList[taskIdx];
    this.setState({
      isTaskAdded: isTaskAddedList,
    });
  }

  static renderDeleteIcon() {
    return (
      <DeleteTask
        disabled={false}
        margin={{ 'margin-left': '4.2rem' }}
        onClick={() => this.onDeleteTask()}
        toolTipPosition="left"
      />
    );
  }

  render() {
    const { tasks, onAddTaskClick } = this.props;
    const { isTaskAdded } = this.state;
    return (
        <>
          <header>
            <h3 styleName="optional-task-heading">ADD NEW TASK</h3>
          </header>
          {
            tasks.map((task, index) => (
              <Grid
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
                      isTaskAdded[index] ? this.constructor.renderDeleteIcon()
                        : (
                          <span styleName="optional-task-details">
                            <AddTask
                              disabled={false}
                              margin={{ 'margin-left': '3rem' }}
                              onClick={() => this.onAddTask(index)}
                              toolTipPosition="left"
                            />
                          </span>
                        )
                      }
                </Grid>
              </Grid>
            ))
          }
          <Close disabled={false} onClick={() => onAddTaskClick()} />
        </>);
  }
}

OptionalTaskDetails.propTypes = {
  onAddTaskClick: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default OptionalTaskDetails;

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
    this.state = {
      isTaskAdded: false,
    };
  }

  onAddTask() {
    const { isTaskAdded } = this.state;
    this.setState({
      isTaskAdded: !isTaskAdded,
    });
  }

  onDeleteTask() {
    console.log('test');
  }

  static renderDeleteIcon() {
    return (
      <DeleteTask onClick={() => this.onDeleteTask()} />
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
            tasks.map(task => (
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
                      isTaskAdded ? this.constructor.renderDeleteIcon()
                        : (
                          <span styleName="optional-task-details">
                            <AddTask
                              disabled={false}
                              margin={{ 'margin-left': '3rem' }}
                              onClick={() => this.onAddTask()}
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

import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddTask from '../LeftTaskPane/AddTask';
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

  static renderDeleteIcon() {
    return (
      <IconButton>
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
          <path d="M0 0h24v24H0V0z" fill="none" />
        </svg>
      </IconButton>
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
          tasks.filter(({ visibility }) => visibility)
            .map(task => (
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
                  <span styleName="parent-task-name">{ R.pathOr('', ['taskBlueprint', 'name'], task) }</span>
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

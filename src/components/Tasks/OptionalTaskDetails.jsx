import React from 'react';
import PropTypes from 'prop-types';
// import * as R from 'ramda';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CollapseIcon from 'components/Tasks/CollapseIcon';
// import LeftParentTasks from './LeftParentTasks';
import AddTask from '../LeftTaskPane/AddTask';
import BackToAllTasks from '../LeftTaskPane/BackToAllTasks';
import TaskStatusIcon from '../TaskStatusIcon/TaskStatusIcon';
import './LeftParentTasks.css';

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
            <h3>ADD NEW TASK (OPTIONAL)</h3>
            <CollapseIcon
              direction="left"
            />
          </header>
          {
        tasks.filter(({ visibility }) => visibility)
          .map(task => (
            <div styleName="task-group">
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <span title="test">
                    <TaskStatusIcon styleName="icon-padding" task={task} />
                  </span>
                  {
            isTaskAdded ? this.constructor.renderDeleteIcon()
              : (
                <AddTask
                  disabled={false}
                  onClick={() => this.onAddTask()}
                  toolTipPosition="left"
                />
              )
        }
                </Grid>
              </Grid>
              {/* {
                 LeftParentTasks.renderCollapsedView(task)
        } */}
            </div>
          )) }
          <BackToAllTasks disabled={false} onClick={() => onAddTaskClick()} />
        </>
    );
  }
}

OptionalTaskDetails.propTypes = {
  onAddTaskClick: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default OptionalTaskDetails;

import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import './TaskStatusIcon.css';


function getIcon(task, isSubTask, checked = false) {
  let iconName = 'default_unselected';
  if (task.checked || checked) {
    iconName = 'default_selected';
  }
  if (task.completed) {
    iconName = isSubTask ? 'default_selected_green_small' : 'default_selected_green';
  }
  if (task.failure) {
    iconName = isSubTask ? 'default_error_small' : 'default_error';
  }
  return <img alt="task_pane_icon" src={`/static/img/${iconName}.svg`} styleName={isSubTask ? 'smallIcon' : 'largeIcon'} />;
}

function TaskStatusIcon({ task, isSubTask }) {
  return (
    <Checkbox
      checked={task.checked}
      checkedIcon={getIcon(task, isSubTask, true)}
      classes={{
        checked: 'checked-circle',
      }}
      icon={getIcon(task, isSubTask)}
    />
  );
}

TaskStatusIcon.defaultProps = {
  isSubTask: false,
};

TaskStatusIcon.propTypes = {
  isSubTask: PropTypes.bool,
  task: PropTypes.shape({
    failure: PropTypes.bool,
    taskName: PropTypes.string,
  }).isRequired,
};

export default TaskStatusIcon;

import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import './TaskStatusIcon.css';


function getIcon(task, isSubTask, checked = false) {
  let iconName = '';
  switch (task.state) {
    case 'completed':
      iconName = isSubTask ? 'default_selected_green_small' : 'default_selected_green';
      break;
    case 'failed':
      iconName = isSubTask ? 'default_error_small' : 'default_error';
      break;
    default:
      iconName = task.checked || checked ? 'default_selected' : 'default_unselected';
  }
  return <img alt="task_pane_icon" src={`/static/img/${iconName}.svg`} styleName={isSubTask ? 'smallIcon' : 'largeIcon'} />;
}

function TaskStatusIcon({ className, task, isSubTask }) {
  return (
    <Checkbox
      checked={task.checked}
      checkedIcon={getIcon(task, isSubTask, true)}
      classes={{
        checked: 'checked-circle',
        root: className,
      }}
      icon={getIcon(task, isSubTask)}
    />
  );
}

TaskStatusIcon.defaultProps = {
  className: '',
  isSubTask: false,
};

TaskStatusIcon.propTypes = {
  className: PropTypes.string,
  isSubTask: PropTypes.bool,
  task: PropTypes.shape({
    failure: PropTypes.bool,
    taskName: PropTypes.string,
  }).isRequired,
};

export default TaskStatusIcon;

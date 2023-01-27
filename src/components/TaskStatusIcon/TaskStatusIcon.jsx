import React from 'react';
import PropTypes from 'prop-types';
import './TaskStatusIcon.css';

function getIcon(task, isSubTask, checked = false) {
  let iconName = '';
  switch (task.state) {
    case 'completed':
      iconName = isSubTask ? 'default_selected_blue_small' : 'default_selected_blue';
      break;
    case 'failed':
      iconName = isSubTask ? 'default_error_small' : 'default_error';
      break;
    default:
      iconName = task.checked || checked ? 'default_selected' : 'default_unselected';
  }
  return <img alt="task_pane_icon" src={`/static/img/${iconName}.svg`} styleName={isSubTask ? 'smallIcon' : 'largeIcon'} />;
}

function TaskStatusIcon({
  isSelected,
  task,
  isSubTask,
}) {
  return (
    getIcon(task, isSubTask, isSelected)
  );
}

TaskStatusIcon.defaultProps = {
  className: '',
  isSubTask: false,
  isSelected: false,
};

TaskStatusIcon.propTypes = {
  className: PropTypes.string,
  isSelected: PropTypes.bool,
  isSubTask: PropTypes.bool,
  task: PropTypes.shape({
    failure: PropTypes.bool,
    taskName: PropTypes.string,
  }).isRequired,
};

export { TaskStatusIcon };
export default TaskStatusIcon;

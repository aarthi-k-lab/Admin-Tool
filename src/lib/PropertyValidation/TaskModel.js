import PropTypes from 'prop-types';

const taskModel = {
  failureReason: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  taskBlueprint: PropTypes.shape({ name: PropTypes.string }).isRequired,
};
taskModel.subTasks = PropTypes.arrayOf(PropTypes.shape(taskModel));

export default taskModel;

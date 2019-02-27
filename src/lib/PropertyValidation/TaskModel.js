import PropTypes from 'prop-types';

const taskModel = {
  state: PropTypes.string.isRequired,
  failureReason: PropTypes.string.isRequired,
  taskBlueprint: PropTypes.shape({ name: PropTypes.string }).isRequired,
};
taskModel.subTasks = PropTypes.arrayOf(taskModel);

export default taskModel;

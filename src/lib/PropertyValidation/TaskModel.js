import PropTypes from 'prop-types';

const taskModel = {
  failureReason: PropTypes.string,
  state: PropTypes.string,
  taskBlueprint: PropTypes.shape({ name: PropTypes.string }).isRequired,
};
taskModel.subTasks = PropTypes.arrayOf(PropTypes.shape(taskModel));

export default taskModel;

import {
  getChecklist,
  getTasks,
} from './actions';

const fetchChecklist = dispatch => taskId => dispatch(getChecklist(taskId));

const fetchTasks = dispatch => (...args) => dispatch(getTasks(...args));

const operations = {
  fetchChecklist,
  fetchTasks,
};

export default operations;

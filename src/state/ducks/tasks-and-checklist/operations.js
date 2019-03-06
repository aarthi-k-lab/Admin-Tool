import {
  getNextChecklist,
  getPrevChecklist,
  getChecklist,
  getTasks,
  handleChecklistItemChange,
  setSelectedChecklist,
} from './actions';

const fetchNextChecklist = dispatch => () => dispatch(getNextChecklist());

const fetchPrevChecklist = dispatch => () => dispatch(getPrevChecklist());

const fetchChecklist = dispatch => (taskId) => {
  dispatch(setSelectedChecklist(taskId));
  dispatch(getChecklist(taskId));
};

const fetchTasks = dispatch => (...args) => dispatch(getTasks(...args));

const handleChecklistItemValueChange = dispatch => (id, value) => {
  dispatch(handleChecklistItemChange(id, value));
};

const operations = {
  fetchChecklist,
  fetchNextChecklist,
  fetchPrevChecklist,
  fetchTasks,
  handleChecklistItemValueChange,
};

export default operations;

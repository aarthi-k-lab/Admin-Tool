import {
  getNextChecklist,
  getPrevChecklist,
  getChecklist,
  getTasks,
  storeTaskFilter,
  handleChecklistItemChange,
  setSelectedChecklist,
  toggleInstructions,
} from './actions';

const fetchNextChecklist = dispatch => () => dispatch(getNextChecklist());

const fetchPrevChecklist = dispatch => () => dispatch(getPrevChecklist());

const fetchChecklist = dispatch => (taskId) => {
  dispatch(setSelectedChecklist(taskId));
  dispatch(getChecklist(taskId));
};

const fetchTasks = dispatch => (...args) => dispatch(getTasks(...args));

const saveTaskFilter = dispatch => taskFilter => dispatch(storeTaskFilter(taskFilter));

const handleChecklistItemValueChange = dispatch => (id, value) => {
  dispatch(handleChecklistItemChange(id, value));
};

const handleToggleInstructions = dispatch => () => dispatch(toggleInstructions());

const operations = {
  fetchChecklist,
  fetchNextChecklist,
  fetchPrevChecklist,
  fetchTasks,
  saveTaskFilter,
  handleChecklistItemValueChange,
  handleToggleInstructions,
};

export default operations;

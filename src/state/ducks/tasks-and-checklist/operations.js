import {
  getNextChecklist,
  getPrevChecklist,
  getChecklist,
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

const saveTaskFilter = dispatch => taskFilter => dispatch(storeTaskFilter(taskFilter));

const handleChecklistItemValueChange = dispatch => (id, value) => {
  dispatch(handleChecklistItemChange(id, value));
};

const handleToggleInstructions = dispatch => () => dispatch(toggleInstructions());

const operations = {
  fetchChecklist,
  fetchNextChecklist,
  fetchPrevChecklist,
  saveTaskFilter,
  handleChecklistItemValueChange,
  handleToggleInstructions,
};

export default operations;

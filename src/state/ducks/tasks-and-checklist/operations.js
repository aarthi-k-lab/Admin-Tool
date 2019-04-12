import {
  getNextChecklist,
  getPrevChecklist,
  getChecklist,
  storeTaskFilter,
  handleChecklistItemChange,
  setSelectedChecklist,
  toggleInstructions,
  validationDisplayAction,
  dispositionCommentAction,
} from './actions';

const fetchNextChecklist = dispatch => () => dispatch(getNextChecklist());

const fetchPrevChecklist = dispatch => () => dispatch(getPrevChecklist());

const triggerValidationDisplay = dispatch => payload => dispatch(validationDisplayAction(payload));

const dispositionCommentTrigger = dispatch => payload => (
  dispatch(dispositionCommentAction(payload))
);

const fetchChecklist = dispatch => (taskId) => {
  dispatch(setSelectedChecklist(taskId));
  dispatch(getChecklist(taskId));
};

const saveTaskFilter = dispatch => taskFilter => dispatch(storeTaskFilter(taskFilter));

const handleChecklistItemValueChange = dispatch => (id, value, taskCode) => {
  dispatch(handleChecklistItemChange(id, value, taskCode));
};

const handleToggleInstructions = dispatch => () => dispatch(toggleInstructions());

const operations = {
  fetchChecklist,
  fetchNextChecklist,
  fetchPrevChecklist,
  saveTaskFilter,
  handleChecklistItemValueChange,
  handleToggleInstructions,
  triggerValidationDisplay,
  dispositionCommentTrigger,
};

export default operations;

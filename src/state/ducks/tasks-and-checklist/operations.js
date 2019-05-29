import {
  getNextChecklist,
  getHistoricalCheckList,
  getPrevChecklist,
  getChecklist,
  storeTaskFilter,
  handleChecklistItemChange,
  setSelectedChecklist,
  toggleInstructions,
  showOptionalTasks,
  validationDisplayAction,
  dispositionCommentAction,
  deleteTask,
  updateChecklist,
  showDeleteTaskConfirmation,
  resetDeleteTaskConfirmation,
  subTaskClearance,
} from './actions';

const fetchHistoricalCheckList = dispatch => payload => dispatch(getHistoricalCheckList(payload));

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

const handleShowOptionalTasks = dispatch => () => dispatch(showOptionalTasks());

const handleShowDeleteTaskConfirmation = dispatch => (payload) => {
  dispatch(showDeleteTaskConfirmation(payload));
};

const handleDeleteTask = dispatch => (shouldDeleteTask) => {
  dispatch(deleteTask(shouldDeleteTask));
};

const handleUpdateChecklist = dispatch => (payload) => {
  dispatch(updateChecklist(payload));
};

const resetDeleteTaskConfirmationValues = dispatch => () => dispatch(resetDeleteTaskConfirmation());

const handleSubTaskClearance = dispatch => (taskId, taskBluePrintCode) => {
  dispatch(subTaskClearance(taskId, taskBluePrintCode));
};

const operations = {
  fetchChecklist,
  fetchNextChecklist,
  fetchPrevChecklist,
  saveTaskFilter,
  handleChecklistItemValueChange,
  handleToggleInstructions,
  handleShowOptionalTasks,
  handleShowDeleteTaskConfirmation,
  triggerValidationDisplay,
  dispositionCommentTrigger,
  handleDeleteTask,
  handleUpdateChecklist,
  resetDeleteTaskConfirmationValues,
  handleSubTaskClearance,
  fetchHistoricalCheckList,
};

export default operations;

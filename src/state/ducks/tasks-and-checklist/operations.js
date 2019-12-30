import {
  getNextChecklist,
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
  emptyDispositionComment,
  dispositionComments,
  getDropDownOptions,
  getHistoricalCheckListData,
  setResolutionIdStats,
  setFilterRules,
  discardRuleResponse,
} from './actions';

const fetchHistoricalChecklistData = dispatch => (taskId) => {
  dispatch(getHistoricalCheckListData(taskId));
};
const fetchNextChecklist = dispatch => () => dispatch(getNextChecklist());

const fetchPrevChecklist = dispatch => () => dispatch(getPrevChecklist());

const triggerValidationDisplay = dispatch => payload => dispatch(validationDisplayAction(payload));

const dispositionCommentTrigger = dispatch => payload => (
  dispatch(dispositionCommentAction(payload))
);

const changeDispositionComments = dispatch => payload => (
  dispatch(dispositionComments(payload))
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

const clearDispositionComments = dispatch => () => dispatch(emptyDispositionComment());

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
  dispatch(emptyDispositionComment());
};

const fetchDropDownOptions = dispatch => (source, additionalInfo) => {
  dispatch(getDropDownOptions(source, additionalInfo));
};


const triggerResolutionIdStats = dispatch => (resolutionId, auditRuleType) => {
  dispatch(setResolutionIdStats(resolutionId, auditRuleType));
};

const triggerFilterRules = dispatch => (payload) => {
  dispatch(setFilterRules(payload));
};


const clearRuleResponse = dispatch => () => dispatch(discardRuleResponse());


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
  clearDispositionComments,
  changeDispositionComments,
  fetchDropDownOptions,
  fetchHistoricalChecklistData,
  triggerResolutionIdStats,
  triggerFilterRules,
  clearRuleResponse,
};

export default operations;

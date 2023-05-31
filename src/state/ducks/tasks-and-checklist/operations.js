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
  setSLAvalues,
  setCurrentChecklistId,
  setNewChecklist,
  pushDataAction,
  computeRulesPassed,
  currentChecklistTypeAction,
  fetchFicoHistoryAction,
  setFicoScoreAction,
  ficoLockAction,
  setAssetDetailAction,
  setRadioSelectDetailAction,
  assetLockAction,
  fetchAssetHistoriesAction,
  fetchAssetHistoryForAssetIdAction,
  setAssetHistoryViewAction,
  clearFicoAssetData,
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

const triggerSetSLAvalues = dispatch => (resolutionId, auditRuleType) => {
  dispatch(setSLAvalues(resolutionId, auditRuleType));
};


const clearRuleResponse = dispatch => () => dispatch(discardRuleResponse());

const storeCurrentChecklistId = dispatch => (id) => {
  dispatch(setCurrentChecklistId(id));
};

const storeNewChecklist = dispatch => (id) => {
  dispatch(setNewChecklist(id));
};

const triggerPushData = dispatch => () => dispatch(pushDataAction());

const putComputeRulesPassed = dispatch => payload => dispatch(computeRulesPassed(payload));


const preProcessChecklistItems = dispatch => (type, payload) => {
  dispatch({ type, payload });
};


const currentChecklistType = dispatch => (payload) => {
  dispatch(currentChecklistTypeAction(payload));
};

const fetchFicoHistoryOperation = dispatch => () => {
  dispatch(fetchFicoHistoryAction());
};

const setFicoScoreOperation = dispatch => (payload) => {
  dispatch(setFicoScoreAction(payload));
};

const ficoLockOperation = dispatch => () => {
  dispatch(ficoLockAction());
};

const setAssetDetailOperation = dispatch => (payload) => {
  dispatch(setAssetDetailAction(payload));
};

const setRadioSelectDetailOperation = dispatch => (payload) => {
  dispatch(setRadioSelectDetailAction(payload));
};

const assetLockOperation = dispatch => () => {
  dispatch(assetLockAction());
};

const fetchAssetHistoriesOperations = dispatch => () => {
  dispatch(fetchAssetHistoriesAction());
};

const fetchAssetHistoryForAssetIdOperation = dispatch => (payload) => {
  dispatch(fetchAssetHistoryForAssetIdAction(payload));
};

const setAssetHistoryViewOperation = dispatch => (payload) => {
  dispatch(setAssetHistoryViewAction(payload));
};

const clearFicoAssetDataOperation = dispatch => () => {
  dispatch(clearFicoAssetData());
};

const operations = {
  currentChecklistType,
  preProcessChecklistItems,
  putComputeRulesPassed,
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
  triggerSetSLAvalues,
  storeCurrentChecklistId,
  storeNewChecklist,
  triggerPushData,
  fetchFicoHistoryOperation,
  setFicoScoreOperation,
  ficoLockOperation,
  setAssetDetailOperation,
  setRadioSelectDetailOperation,
  assetLockOperation,
  fetchAssetHistoriesOperations,
  fetchAssetHistoryForAssetIdOperation,
  setAssetHistoryViewOperation,
  clearFicoAssetDataOperation,
};

export default operations;

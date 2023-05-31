import {
  GET_NEXT_CHECKLIST,
  GET_PREV_CHECKLIST,
  GET_CHECKLIST_SAGA,
  GET_HISTORICAL_CHECKLIST_DATA,
  GET_TASKS_SAGA,
  HANDLE_CHECKLIST_ITEM_CHANGE,
  RESET_DATA,
  SET_SELECTED_CHECKLIST,
  STORE_CURRENT_CHECKLIST,
  STORE_CHECKLIST_NAVIGATION,
  STORE_PROCESS_DETAILS,
  STORE_TASKS,
  STORE_TASK_FILTER,
  STORE_OPTIONAL_TASKS,
  TOGGLE_INSTRUCTIONS,
  SHOW_OPTIONAL_TASKS,
  VALIDATION_DISPLAY,
  DISP_COMMENT_SAGA,
  EMPTY_DISPOSITION_COMMENT,
  DELETE_TASK,
  UPDATE_CHECKLIST,
  SHOW_DELETE_TASK_CONFIRMATION,
  RESET_DELETE_TASK,
  CLEAR_SUBTASK,
  UPDATE_COMMENTS,
  FETCH_DROPDOWN_OPTIONS_SAGA,
  GET_RESOLUTION_ID_STATS,
  FILTER_RULES,
  CLEAR_RULE_RESPONSE,
  SET_SLA_VALUES,
  SET_NEW_CHECKLIST,
  PUSH_DATA,
  COMPUTE_RULES_PASSED,
  FETCH_MONTHLY_EXPENSE_VALUES,
  CURRENT_CHECKLIST_TYPE,
  FETCH_FICO_HISTORY,
  SET_FICO_SCORE,
  FICO_LOCK,
  SET_ASSET_DETAILS,
  SET_RADIO_STATE_DETAIL,
  ASSET_LOCK,
  FETCH_ASSET_HISTORIES,
  FETCH_ASSET_HISTORY_FOR_ASSET_ID,
  SET_HISTORY_VIEW,
  CLEAR_FICO_ASSET_DATA,
} from './types';

const currentChecklistTypeAction = payload => ({
  type: CURRENT_CHECKLIST_TYPE,
  payload,
});


const getNextChecklist = () => ({
  type: GET_NEXT_CHECKLIST,
});

const getPrevChecklist = () => ({
  type: GET_PREV_CHECKLIST,
});

const validationDisplayAction = payload => ({
  type: VALIDATION_DISPLAY,
  payload,
});

const dispositionComments = payload => ({
  type: UPDATE_COMMENTS,
  payload,
});
const dispositionCommentAction = payload => ({
  type: DISP_COMMENT_SAGA,
  payload,
});
const getChecklist = taskId => ({
  type: GET_CHECKLIST_SAGA,
  payload: {
    taskId,
  },
});

const getHistoricalCheckListData = taskId => ({
  type: GET_HISTORICAL_CHECKLIST_DATA,
  payload: {
    taskId,
  },
});

const getTasks = (depth = 3) => ({
  type: GET_TASKS_SAGA,
  payload: {
    depth,
  },
});

const handleChecklistItemChange = (id, value, taskCode) => ({
  type: HANDLE_CHECKLIST_ITEM_CHANGE,
  payload: {
    id,
    value,
    taskCode,
  },
});

const resetChecklistData = () => ({
  type: RESET_DATA,
});

const setSelectedChecklist = taskId => ({
  type: SET_SELECTED_CHECKLIST,
  payload: {
    taskId,
  },
});

const storeTasks = taskTree => ({
  type: STORE_TASKS,
  payload: taskTree,
});

const storeTaskFilter = taskFilter => ({
  type: STORE_TASK_FILTER,
  payload: taskFilter,
});
const storeChecklistNavigation = navDataStructure => ({
  type: STORE_CHECKLIST_NAVIGATION,
  payload: navDataStructure,
});

const storeOptionalTasks = optionalTasks => ({
  type: STORE_OPTIONAL_TASKS,
  payload: optionalTasks,
});

const storeProcessDetails = (processId, rootTaskId) => ({
  type: STORE_PROCESS_DETAILS,
  payload: {
    processId,
    rootTaskId,
  },
});

const toggleInstructions = () => ({
  type: TOGGLE_INSTRUCTIONS,
});

const showOptionalTasks = () => ({
  type: SHOW_OPTIONAL_TASKS,
});

const emptyDispositionComment = () => ({
  type: EMPTY_DISPOSITION_COMMENT,
});

const deleteTask = shouldDeleteTask => ({
  type: DELETE_TASK,
  payload: {
    shouldDeleteTask,
  },
});

const updateChecklist = payload => ({
  type: UPDATE_CHECKLIST,
  payload,
});

const showDeleteTaskConfirmation = payload => ({
  type: SHOW_DELETE_TASK_CONFIRMATION,
  payload,
});

const resetDeleteTaskConfirmation = () => ({ type: RESET_DELETE_TASK });

const subTaskClearance = (taskId, rootTaskId, taskBluePrintCode) => ({
  type: CLEAR_SUBTASK,
  payload: {
    id: taskId,
    rootTaskId,
    taskBlueprintCode: taskBluePrintCode,

  },
});

const getDropDownOptions = (source, additionalInfo) => ({
  type: FETCH_DROPDOWN_OPTIONS_SAGA,
  payload: {
    source,
    additionalInfo,
  },
});

const getMonthlyExpenseValues = (source, selector) => ({
  type: FETCH_MONTHLY_EXPENSE_VALUES,
  payload: {
    source, selector,
  },
});

const setResolutionIdStats = (resolutionId, auditRuleType) => ({
  type: GET_RESOLUTION_ID_STATS,
  payload: {
    resolutionId, auditRuleType,
  },
});

const setFilterRules = payload => ({
  type: FILTER_RULES,
  payload,
});

const discardRuleResponse = () => ({
  type: CLEAR_RULE_RESPONSE,
});

const setSLAvalues = (resolutionId, auditRuleType) => ({
  type: SET_SLA_VALUES,
  payload: {
    resolutionId, auditRuleType,
  },
});

const setCurrentChecklistId = id => ({
  type: STORE_CURRENT_CHECKLIST,
  payload: {
    id,
  },
});

const setNewChecklist = id => ({
  type: SET_NEW_CHECKLIST,
  payload: {
    id,
  },
});

const pushDataAction = () => ({
  type: PUSH_DATA,
});

const computeRulesPassed = payload => ({
  type: COMPUTE_RULES_PASSED,
  payload,
});

const fetchFicoHistoryAction = () => ({
  type: FETCH_FICO_HISTORY,
});

const setFicoScoreAction = payload => ({
  type: SET_FICO_SCORE,
  payload,
});

const ficoLockAction = () => ({
  type: FICO_LOCK,
});

const setAssetDetailAction = payload => ({
  type: SET_ASSET_DETAILS,
  payload,
});

const setRadioSelectDetailAction = payload => ({
  type: SET_RADIO_STATE_DETAIL,
  payload,
});

const assetLockAction = () => ({
  type: ASSET_LOCK,
});

const fetchAssetHistoriesAction = () => ({
  type: FETCH_ASSET_HISTORIES,
});

const fetchAssetHistoryForAssetIdAction = payload => ({
  type: FETCH_ASSET_HISTORY_FOR_ASSET_ID,
  payload,
});

const setAssetHistoryViewAction = payload => ({
  type: SET_HISTORY_VIEW,
  payload,
});

const clearFicoAssetData = () => ({
  type: CLEAR_FICO_ASSET_DATA,
});

export {
  currentChecklistTypeAction,
  computeRulesPassed,
  getNextChecklist,
  getPrevChecklist,
  getChecklist,
  getTasks,
  handleChecklistItemChange,
  resetChecklistData,
  setSelectedChecklist,
  storeChecklistNavigation,
  storeProcessDetails,
  storeTasks,
  storeTaskFilter,
  storeOptionalTasks,
  toggleInstructions,
  showOptionalTasks,
  validationDisplayAction,
  dispositionCommentAction,
  emptyDispositionComment,
  deleteTask,
  updateChecklist,
  showDeleteTaskConfirmation,
  resetDeleteTaskConfirmation,
  subTaskClearance,
  getHistoricalCheckListData,
  dispositionComments,
  getDropDownOptions,
  setResolutionIdStats,
  setFilterRules,
  discardRuleResponse,
  setSLAvalues,
  setCurrentChecklistId,
  setNewChecklist,
  pushDataAction,
  getMonthlyExpenseValues,
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
};

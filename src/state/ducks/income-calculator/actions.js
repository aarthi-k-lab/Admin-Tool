import {
  TOGGLE_HISTORY_VIEW, FETCH_CHECKLIST,
  STORE_PROCESS_DETAILS, SET_SELECTED_CHECKLIST,
  STORE_TASKS, RESET_DATA, HANDLE_CHECKLIST_ITEM_CHANGE,
  SET_INCOMECALC_TOGGLE, FETCH_HISTORY_INFO,
  PROCESS_VALIDATIONS, DUPLICATE_INCOME, FETCH_INCOMECALC_CHECKLIST,
  SET_HISTORY_ITEM,
  CLOSE_INC_HISTORY,
  LOCK_INCOME_CALCULATION,
  STORE_TASK_VALUE,
  FETCH_SELECTED_BORROWER_DATA,
  FICO_LOCK_CALCULATION,
  ASSET_LOCK_CALCULATION,
  SET_SELECTED_BORROWER,
  FETCH_FICO_TABLE_DATA,
  ADD_CONTRIBUTOR_FICO,
  SET_INCOME_VERIFICATION_STATUS,
} from './types';


const fetchHistoryChecklist = payload => ({
  type: FETCH_HISTORY_INFO,
  payload,
});

const closeIncomeHistory = payload => ({
  type: CLOSE_INC_HISTORY,
  payload,
});

const toggleHistoryView = payload => ({
  type: TOGGLE_HISTORY_VIEW,
  payload,
});

const getIncomeCalcChecklist = payload => ({
  type: FETCH_INCOMECALC_CHECKLIST,
  payload,
});

const fetchChecklist = payload => ({
  type: FETCH_CHECKLIST,
  payload,
});

const onLockCalc = () => ({
  type: LOCK_INCOME_CALCULATION,
});

const setHistoryItem = payload => ({
  type: SET_HISTORY_ITEM,
  payload,
});

const setVerificationStatus = payload => ({
  type: SET_INCOME_VERIFICATION_STATUS,
  payload,
});

const duplicateIncomeChecklist = payload => ({
  type: DUPLICATE_INCOME,
  payload,
});

const storeProcessDetails = processDetails => ({
  type: STORE_PROCESS_DETAILS,
  payload: processDetails,
});


const resetIncomeChecklistData = () => ({
  type: RESET_DATA,
});

const storeTasks = taskTree => ({
  type: STORE_TASKS,
  payload: taskTree,
});

const setSelectedChecklist = taskId => ({
  type: SET_SELECTED_CHECKLIST,
  payload: {
    taskId,
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

const incomeCalcToggleAction = payload => ({
  type: SET_INCOMECALC_TOGGLE,
  payload,
});


const processValidations = payload => ({
  type: PROCESS_VALIDATIONS,
  payload,
});

const storeTaskValueAction = payload => ({
  type: STORE_TASK_VALUE,
  payload,
});

const fetchSelectedBorrowerData = payload => ({
  type: FETCH_SELECTED_BORROWER_DATA,
  payload,
});


const handleFicoLockCalculation = payload => ({
  type: FICO_LOCK_CALCULATION,
  payload,
});

const handleAssetVerificationLockCalculation = payload => ({
  type: ASSET_LOCK_CALCULATION,
  payload,
});

const setSelectedBorrowerAction = payload => ({
  type: SET_SELECTED_BORROWER,
  payload,
});

const handleFicoHistory = payload => ({
  type: FETCH_FICO_TABLE_DATA,
  payload,
});

const handleAddContributor = payload => ({
  type: ADD_CONTRIBUTOR_FICO,
  payload,
});

export {
  onLockCalc,
  closeIncomeHistory,
  processValidations,
  incomeCalcToggleAction,
  fetchChecklist,
  storeProcessDetails,
  setSelectedChecklist,
  storeTasks,
  resetIncomeChecklistData,
  handleChecklistItemChange,
  duplicateIncomeChecklist,
  getIncomeCalcChecklist,
  toggleHistoryView,
  setHistoryItem,
  setVerificationStatus,
  fetchHistoryChecklist,
  storeTaskValueAction,
  fetchSelectedBorrowerData,
  handleFicoLockCalculation,
  setSelectedBorrowerAction,
  handleAssetVerificationLockCalculation,
  handleFicoHistory,
  handleAddContributor,
};

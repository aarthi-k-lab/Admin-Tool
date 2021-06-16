import {
  TOGGLE_HISTORY_VIEW, FETCH_CHECKLIST,
  STORE_PROCESS_DETAILS, SET_SELECTED_CHECKLIST,
  STORE_TASKS, RESET_DATA, HANDLE_CHECKLIST_ITEM_CHANGE,
  SET_INCOMECALC_TOGGLE, FETCH_HISTORY_INFO,
  PROCESS_VALIDATIONS, DUPLICATE_INCOME, FETCH_INCOMECALC_CHECKLIST,
  SET_HISTORY_ITEM,
  CLOSE_INC_HISTORY,
  LOCK_INCOME_CALCULATION,
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
  fetchHistoryChecklist,
};

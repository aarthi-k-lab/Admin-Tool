import {
  TOGGLE_HISTORY_VIEW,
  SELECTED_INCOMETYPE, FETCH_CHECKLIST,
  STORE_PROCESS_DETAILS, STORE_CHECKLIST_NAVIGATION, SET_SELECTED_CHECKLIST,
  STORE_TASKS, RESET_DATA, HANDLE_CHECKLIST_ITEM_CHANGE, STORE_BORROWER,
  SET_ADD_TASKID, SET_REMOVE_TASKID, DELETE_CHECKLIST,
  SET_INCOMECALC_TOGGLE,
  PROCESS_VALIDATIONS, DUPLICATE_INCOME, FETCH_INCOMECALC_CHECKLIST,
  SET_HISTORY_ITEM,
} from './types';

const toggleHistoryView = payload => ({
  type: TOGGLE_HISTORY_VIEW,
  payload,
});

const getIncomeCalcChecklist = payload => ({
  type: FETCH_INCOMECALC_CHECKLIST,
  payload,
});

const getSelectedIncomeType = payload => ({
  type: SELECTED_INCOMETYPE,
  payload,
});

const setSelectedBorrower = payload => ({
  type: STORE_BORROWER,
  payload,
});

const fetchChecklist = payload => ({
  type: FETCH_CHECKLIST,
  payload,
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

const storeChecklistNavigation = navDataStructure => ({
  type: STORE_CHECKLIST_NAVIGATION,
  payload: navDataStructure,
});

const resetChecklistData = () => ({
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

const onDeleteAction = (id, taskCode) => ({
  type: DELETE_CHECKLIST,
  payload: {
    id,
    taskCode,
  },
});

const triggerAddTask = taskId => ({
  type: SET_ADD_TASKID,
  payload: {
    taskId,
  },
});

const triggerRemoveClick = taskIds => ({
  type: SET_REMOVE_TASKID,
  payload: {
    taskIds,
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
  processValidations,
  incomeCalcToggleAction,
  getSelectedIncomeType,
  fetchChecklist,
  storeProcessDetails,
  storeChecklistNavigation,
  setSelectedChecklist,
  storeTasks,
  resetChecklistData,
  handleChecklistItemChange,
  setSelectedBorrower,
  triggerAddTask,
  triggerRemoveClick,
  onDeleteAction,
  duplicateIncomeChecklist,
  getIncomeCalcChecklist,
  toggleHistoryView,
  setHistoryItem,
};

import {
  handleChecklistItemChange,
  incomeCalcToggleAction,
  duplicateIncomeChecklist,
  getIncomeCalcChecklist,
  toggleHistoryView,
  setHistoryItem,
  closeIncomeHistory,
  fetchHistoryChecklist,
  onLockCalc,
  storeTaskValueAction,
  handleFicoLockCalculation,
  setSelectedBorrowerAction,
} from './actions';

const enableHistoryView = dispatch => (item) => {
  dispatch(fetchHistoryChecklist(item.taskCheckListId));
  dispatch(setHistoryItem(item));
  dispatch(toggleHistoryView(true));
};

const closeHistoryView = dispatch => (payload) => {
  dispatch(closeIncomeHistory(payload));
  dispatch(setHistoryItem(null));
  dispatch(toggleHistoryView(false));
};

const incomeCalcChecklist = dispatch => payload => dispatch(
  getIncomeCalcChecklist(payload),
);

const handleChecklistItemValueChange = dispatch => (id, value, taskCode) => {
  dispatch(handleChecklistItemChange(id, value, taskCode));
};

const duplicateHistoryChecklist = dispatch => (checklistId) => {
  dispatch(duplicateIncomeChecklist(checklistId));
};

const incomeCalcWidgetToggle = dispatch => (payload) => {
  dispatch(incomeCalcToggleAction(payload));
};

const lockCalculation = dispatch => () => dispatch(onLockCalc());

const storeTaskValue = dispatch => (key, value) => dispatch(storeTaskValueAction({ key, value }));

const ficoLockCalculation = dispatch => (payload) => {
  dispatch(handleFicoLockCalculation(payload));
};
const setSelectedBorrower = dispatch => (payload) => {
  dispatch(setSelectedBorrowerAction(payload));
};

const operations = {
  lockCalculation,
  incomeCalcWidgetToggle,
  enableHistoryView,
  handleChecklistItemValueChange,
  duplicateHistoryChecklist,
  incomeCalcChecklist,
  closeHistoryView,
  storeTaskValue,
  ficoLockCalculation,
  setSelectedBorrower,
};

export default operations;

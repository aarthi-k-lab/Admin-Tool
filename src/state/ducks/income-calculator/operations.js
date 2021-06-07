import {
  handleChecklistItemChange,
  incomeCalcToggleAction,
  duplicateIncomeChecklist,
  getIncomeCalcChecklist,
  toggleHistoryView,
  setHistoryItem,
  closeIncomeHistory,
  fetchHistoryChecklist,
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

const operations = {
  incomeCalcWidgetToggle,
  enableHistoryView,
  handleChecklistItemValueChange,
  duplicateHistoryChecklist,
  incomeCalcChecklist,
  closeHistoryView,
};

export default operations;

import {
  getSelectedIncomeType, fetchChecklist,
  handleChecklistItemChange, setSelectedBorrower, triggerAddTask,
  triggerRemoveClick,
  onDeleteAction,
  incomeCalcToggleAction,
  duplicateIncomeChecklist,
  getIncomeCalcChecklist,
  toggleHistoryView,
  setHistoryItem,
  closeIncomeHistory,
} from './actions';

const getSelectedIncomeTypeData = dispatch => request => dispatch(
  getSelectedIncomeType(request),
);

const saveSelectedBorrower = dispatch => request => dispatch(
  setSelectedBorrower(request),
);

const enableHistoryView = dispatch => (item) => {
  dispatch(fetchChecklist(item.taskCheckListId));
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

const onDelete = dispatch => (id, taskCode) => {
  dispatch(onDeleteAction(id, taskCode));
};

const handleChecklistItemValueChange = dispatch => (id, value, taskCode) => {
  dispatch(handleChecklistItemChange(id, value, taskCode));
};

const onAddTask = dispatch => request => dispatch(
  triggerAddTask(request),
);

const onRemoveTask = dispatch => request => dispatch(
  triggerRemoveClick(request),
);

const duplicateHistoryChecklist = dispatch => (checklistId) => {
  dispatch(duplicateIncomeChecklist(checklistId));
};

const incomeCalcWidgetToggle = dispatch => (payload) => {
  dispatch(incomeCalcToggleAction(payload));
};


const operations = {
  incomeCalcWidgetToggle,
  getSelectedIncomeTypeData,
  enableHistoryView,
  handleChecklistItemValueChange,
  saveSelectedBorrower,
  onAddTask,
  onRemoveTask,
  onDelete,
  duplicateHistoryChecklist,
  incomeCalcChecklist,
  closeHistoryView,
};

export default operations;

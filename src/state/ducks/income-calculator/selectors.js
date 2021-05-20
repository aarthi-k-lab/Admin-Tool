import * as R from 'ramda';
import dashboardSelectors from 'ducks/dashboard/selectors';

const getBorrowersInfo = state => (
  state.incomeCalculator.processedBorrowerData ? state.incomeCalculator.processedBorrowerData : []);

const getDirtyChecklistValueById = (id, state) => (
  R.compose(
    R.prop('value'),
    R.last,
    R.pathOr([], ['incomeCalculator', 'dirtyChecklistItems', `${id}`]),
  )(state)
);

const getCurrentChecklistValue = ({ _id: id, value }, state) => {
  const dirtyValue = getDirtyChecklistValueById(id, state);
  if (R.isNil(dirtyValue)) {
    return value;
  }
  return dirtyValue;
};

const inProgress = state => R.pathOr(false, ['incomeCalculator', 'inProgress'], state);
const getIncomeType = state => R.pathOr(false, ['incomeCalculator', 'incomeType'], state);
const getRootTaskId = state => R.pathOr('', ['incomeCalculator', 'rootTaskId'], state);
const getSelectedBorrower = state => R.pathOr(null, ['incomeCalculator', 'selectedBorrower'], state);
const getIncomeChecklistLoadStatus = state => R.path(['incomeCalculator', 'checklistLoadingStatus'], state);
const getTaskLoadStatus = state => R.path(['incomeCalculator', 'taskLoadingStatus'], state);
const getChecklist = state => R.path(['incomeCalculator', 'checklist'], state);
const getChecklistTemplate = state => R.compose(
  R.path(['processBlueprintCode']),
  R.head,
  R.path(['incomeCalculator', 'checklist']),
)(state);

const getChecklistItems = state => R.compose(
  R.map(checklistItem => ({
    id: R.prop('_id', checklistItem),
    disabled: !dashboardSelectors.isAssigned(state)
    || R.propOr(false, 'disabled', checklistItem),
    isVisible: R.propOr(true, 'visibility', checklistItem),
    subTasks: R.propOr([], 'subTasks', checklistItem),
    options: R.propOr(R.pathOr([], ['taskBlueprint', 'options'], checklistItem), 'options', checklistItem),
    taskCode: R.pathOr([], ['taskBlueprint', 'taskCode'], checklistItem),
    title: R.pathOr([], ['taskBlueprint', 'description'], checklistItem),
    type: R.pathOr([], ['taskBlueprint', 'type'], checklistItem),
    elements: R.pathOr([], ['taskBlueprint', 'elements'], checklistItem),
    value: getCurrentChecklistValue(checklistItem, state),
    source: R.pathOr('', ['taskBlueprint', 'source'], checklistItem),
    additionalInfo: R.pathOr({}, ['taskBlueprint', 'additionalInfo'], checklistItem),
  })),
  R.pathOr([], ['incomeCalculator', 'checklist', 'subTasks']),
)(state);

const getDropDownOptions = state => R.pathOr([], ['incomeCalculator', 'dropDownOptions'], state);

const getDirtyChecklistItemForSave = (state) => {
  const id = R.head(
    R.pathOr([], ['incomeCalculator', 'checklistItemsSaveQueue'], state),
  );
  if (R.isNil(id)) {
    return null;
  }
  const body = R.head(
    R.pathOr([], ['incomeCalculator', 'dirtyChecklistItems', id], state),
  );
  if (R.isNil(body)) {
    return null;
  }
  return {
    id,
    body,
  };
};

const getIncomeToggle = state => R.pathOr(false, ['incomeCalculator', 'incomeCalc'], state);
const getIncomeCalcData = state => R.pathOr({}, ['incomeCalculator'], state);
const getProcessId = state => R.pathOr(null, ['incomeCalculator', 'processId'], state);

const getBorrowers = state => R.pathOr([], ['incomeCalculator', 'processedBorrowerData'], state);

const getBorrowersList = state => R.pathOr([], ['incomeCalculator', 'checklist', 'value', 'inc', 'borrowers'], state);

const getConsolidatedIncome = state => R.pathOr([], ['incomeCalculator', 'checklist', 'value', 'cnsdtIncome'], state);

const getIncomeChecklistRefresh = state => R.pathOr(null, ['incomeCalculator', 'lastUpdated'], state);


const getErrorBanner = state => R.pathOr(null, ['incomeCalculator', 'banner'], state);
const getHistory = state => R.pathOr([], ['incomeCalculator', 'history'], state);

const getTaskCheckListId = state => R.pathOr(null, ['incomeCalculator', 'taskCheckListId'], state);

const getHistoryView = state => R.pathOr(false, ['incomeCalculator', 'isHistoryView'], state);
const getHistoryItem = state => R.pathOr(null, ['incomeCalculator', 'historyItem'], state);

const disabledChecklist = state => R.pathOr(false, ['incomeCalculator', 'disableChecklist'], state);

const selectors = {
  disabledChecklist,
  getHistoryView,
  getTaskCheckListId,
  getErrorBanner,
  getConsolidatedIncome,
  getBorrowersList,
  getBorrowers,
  getProcessId,
  getIncomeCalcData,
  getIncomeToggle,
  getBorrowersInfo,
  getDropDownOptions,
  inProgress,
  getIncomeType,
  getRootTaskId,
  getChecklistItems,
  getDirtyChecklistItemForSave,
  getSelectedBorrower,
  getIncomeChecklistLoadStatus,
  getTaskLoadStatus,
  getChecklistTemplate,
  getChecklist,
  getIncomeChecklistRefresh,
  getHistory,
  getHistoryItem,
};

export default selectors;

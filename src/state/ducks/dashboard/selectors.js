import * as R from 'ramda';

const expandView = state => R.propOr(false, 'expandView', state.dashboard);

const isFirstVisit = state => R.pathOr(false, ['dashboard', 'firstVisit'], state);

const noTasksFound = state => R.pathOr(false, ['dashboard', 'noTasksFound'], state);

const isTasksLimitExceeded = state => R.pathOr(false, ['dashboard', 'isTasksLimitExceeded'], state);

const taskFetchError = state => R.pathOr(false, ['dashboard', 'taskFetchError'], state);

const loanNumber = state => R.pathOr(null, ['dashboard', 'loanNumber'], state);

const clearSearch = state => R.pathOr(false, ['dashboard', 'clearSearch'], state);

const inProgress = state => R.pathOr(false, ['dashboard', 'inProgress'], state);

const saveInProgress = state => R.pathOr(false, ['dashboard', 'saveInProgress'], state);

const evalId = state => R.pathOr(null, ['dashboard', 'evalId'], state);

const taskIterationCounter = state => R.pathOr(null, ['dashboard', 'taskIterationCounter'], state);

const taskId = state => R.pathOr(null, ['dashboard', 'taskId'], state);

const getDisposition = state => R.pathOr('', ['dashboard', 'selectedDisposition'], state);

const searchLoanResult = state => R.pathOr({}, ['dashboard', 'getSearchLoanResponse'], state);

const unassignResult = state => R.pathOr({}, ['dashboard', 'unassignLoanResponse'], state);

const assignResult = state => R.pathOr({}, ['dashboard', 'assignLoanResponse'], state);

const processId = state => R.pathOr(null, ['dashboard', 'processId'], state);

const processStatus = state => R.pathOr(null, ['dashboard', 'processStatus'], state);

const processName = state => R.pathOr(null, ['dashboard', 'processName'], state);

// const getActivityDetails = state => R.pathOr(null, ['dashboard', 'loanActivityDetails'], state);
const comments = state => R.pathOr([], ['dashboard', 'comments'], state);
const groupName = state => R.pathOr(null, ['dashboard', 'groupName'], state);

const taskStatus = state => R.pathOr(null, ['dashboard', 'taskStatus'], state);

const enableGetNext = state => (
  ((isFirstVisit(state)
  || R.pathOr(false, ['dashboard', 'getNextResponse', 'enableGetNext'], state))
  || (isFirstVisit(state)
  || R.pathOr(false, ['dashboard', 'showGetNext'], state))) && (R.pathOr(true, ['dashboard', 'getNextProcessed'], state))
);

// enableEndShift has same conditions as getnext to get enabled
const enableEndShift = state => (
  isFirstVisit(state)
  || R.pathOr(false, ['dashboard', 'getNextResponse', 'enableGetNext'], state)
  || R.pathOr(false, ['dashboard', 'showGetNext'], state)
);

const showAssign = state => R.pathOr(null, ['dashboard', 'showAssign'], state);

const showContinueMyReview = state => R.pathOr(null, ['dashboard', 'showContinueMyReview'], state);

const isAssigned = state => R.pathOr(true, ['dashboard', 'isAssigned'], state);

const getDiscrepancies = state => R.pathOr({}, ['dashboard', 'getNextResponse', 'discrepancies'], state);

// eslint-disable-next-line
const getChecklistDiscrepancies = state => (state.dashboard && state.dashboard.checklistDiscrepancies ? state.dashboard.checklistDiscrepancies : {});

const getChecklistErrorCode = R.pathOr('', ['dashboard', 'checklistErrorCode']);

const getTrialHeader = state => (state.dashboard.trialHeader ? state.dashboard.trialHeader : null);
const getTrialsDetail = state => (state.dashboard.trialsDetail ? state.dashboard.trialsDetail : []);
const getTrialLetter = state => (state.dashboard.trialsLetter ? state.dashboard.trialsLetter : []);
const resultUnderwriting = state => (state.dashboard && state.dashboard.resultUnderwriting
  ? state.dashboard.resultUnderwriting : {});

const selectors = {
  enableEndShift,
  enableGetNext,
  evalId,
  taskIterationCounter,
  noTasksFound,
  taskId,
  expandView,
  getDiscrepancies,
  getDisposition,
  isFirstVisit,
  inProgress,
  loanNumber,
  saveInProgress,
  taskFetchError,
  isTasksLimitExceeded,
  searchLoanResult,
  showAssign,
  showContinueMyReview,
  unassignResult,
  assignResult,
  processId,
  processStatus,
  processName,
  // getActivityDetails,
  isAssigned,
  clearSearch,
  comments,
  groupName,
  getChecklistDiscrepancies,
  getChecklistErrorCode,
  getTrialHeader,
  getTrialsDetail,
  getTrialLetter,
  taskStatus,
  resultUnderwriting,
};

export default selectors;

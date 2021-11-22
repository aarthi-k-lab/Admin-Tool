import * as R from 'ramda';

const expandView = state => R.propOr(false, 'expandView', state.dashboard);

const isFirstVisit = state => R.pathOr(false, ['dashboard', 'firstVisit'], state);

const noTasksFound = state => R.pathOr(false, ['dashboard', 'noTasksFound'], state);

const isGetNextError = state => R.pathOr(false, ['dashboard', 'isGetNextError'], state);

const getNextError = state => R.pathOr(null, ['dashboard', 'getNextError'], state);

const getSelectedWidget = state => R.pathOr([], ['dashboard', 'selectedWidget'], state);

const taskFetchError = state => R.pathOr(false, ['dashboard', 'taskFetchError'], state);

const loanNumber = state => R.pathOr(null, ['dashboard', 'loanNumber'], state);

const clearSearch = state => R.pathOr(false, ['dashboard', 'clearSearch'], state);

const inProgress = state => R.pathOr(false, ['dashboard', 'inProgress'], state);

const resultData = state => R.pathOr({}, ['dashboard', 'resultData'], state);

const resolutionId = state => R.pathOr(null, ['dashboard', 'resolutionId'], state);

const wasSearched = state => R.pathOr(false, ['dashboard', 'wasSearched'], state);

const saveInProgress = state => R.pathOr(false, ['dashboard', 'saveInProgress'], state);

const evalId = state => R.pathOr(null, ['dashboard', 'evalId'], state);
const addInfoEvalId = state => R.pathOr(null, ['dashboard', 'addInfoEvalId'], state);
const taskIterationCounter = state => R.pathOr(null, ['dashboard', 'taskIterationCounter'], state);

const taskId = state => R.pathOr(null, ['dashboard', 'taskId'], state);

const getBookingTaskId = state => R.pathOr(null, ['dashboard', 'bookingTaskId'], state);


const getDisposition = state => R.pathOr('', ['dashboard', 'selectedDisposition'], state);

const searchLoanResult = state => R.pathOr({}, ['dashboard', 'getSearchLoanResponse'], state);

const searchLoanTaskResponse = state => R.pathOr({}, ['dashboard', 'searchLoanTaskResponse'], state);

const unassignResult = state => R.pathOr({}, ['dashboard', 'unassignLoanResponse'], state);

const assignResult = state => R.pathOr({}, ['dashboard', 'assignLoanResponse'], state);

const processId = state => R.pathOr(null, ['dashboard', 'processId'], state);

const processStatus = state => R.pathOr(null, ['dashboard', 'processStatus'], state);

const processName = state => R.pathOr(null, ['dashboard', 'processName'], state);

// const getActivityDetails = state => R.pathOr(null, ['dashboard', 'loanActivityDetails'], state);
const comments = state => R.pathOr([], ['dashboard', 'comments'], state);
const groupName = state => R.pathOr(null, ['dashboard', 'groupName'], state);
const getInvestorHierarchy = state => R.pathOr({}, ['dashboard', 'investorHierarchy'], state);

const tableData = state => R.pathOr([], ['dashboard', 'tableData'], state);
const evalData = state => R.pathOr([], ['dashboard', 'evalInsertionStatus'], state);

const stagerTaskName = state => R.pathOr(null, ['dashboard', 'stagerTaskName'], state);
const brand = state => R.pathOr(null, ['dashboard', 'brand'], state);
const stagerValueState = state => R.pathOr(null, ['dashboard', 'stagerValueAndState'], state);
const isPostModEndShift = state => R.pathOr(null, ['dashboard', 'postModEndShift'], state);
const completeReviewResponse = state => R.pathOr(null, ['dashboard', 'completeReviewResponse'], state);
const disableSendToFEUW = state => R.pathOr(false, ['dashboard', 'disableSendToFEUW'], state);
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

const enableSendToDocGen = state => (R.pathOr(true, ['dashboard', 'enableSendToDocGen'], state));

const enableSendToDocsIn = state => (R.pathOr(true, ['dashboard', 'enableSendToDocsIn'], state));

const enableSendToBooking = state => (R.pathOr(true, ['dashboard', 'enableSendToBooking'], state));

const enableSendToUW = state => (R.pathOr(true, ['dashboard', 'enableSendToUW'], state));

const showContinueMyReview = state => R.pathOr(null, ['dashboard', 'showContinueMyReview'], state);

const showCompleteMyReview = state => R.pathOr(null, ['dashboard', 'isAssigned'], state) && !isFirstVisit(state);

const isAssigned = state => R.pathOr(true, ['dashboard', 'isAssigned'], state);

const getDiscrepancies = state => R.pathOr({}, ['dashboard', 'getNextResponse', 'discrepancies'], state);

const getRejectResponse = state => R.pathOr({}, ['dashboard', 'rejectResponse'], state);

const incentiveTaskCodes = state => R.pathOr({}, ['dashboard', 'incentiveTaskCodes'], state);

const errorBanner = state => R.pathOr({}, ['dashboard', 'banner'], state);
const showBanner = state => R.pathOr(false, ['dashboard', 'showBanner'], state);
const enableLockButton = state => R.pathOr(false, ['dashboard', 'enableLockButton'], state);

// eslint-disable-next-line
const getChecklistDiscrepancies = state => (state.dashboard && state.dashboard.checklistDiscrepancies ? state.dashboard.checklistDiscrepancies : {});

const getChecklistErrorCode = R.pathOr('', ['dashboard', 'checklistErrorCode']);

const getTrialHeader = state => (state.dashboard.trialHeader ? state.dashboard.trialHeader : null);
const getTrialsDetail = state => (state.dashboard.trialsDetail ? state.dashboard.trialsDetail : []);
const getTrialLetter = state => (state.dashboard.trialsLetter ? state.dashboard.trialsLetter : []);
const resultUnderwriting = state => (state.dashboard && state.dashboard.resultUnderwriting
  ? state.dashboard.resultUnderwriting : {});

const resultOperation = state => (state.dashboard && state.dashboard.resultOperation
  ? state.dashboard.resultOperation : {});

const userNotification = state => R.pathOr({}, ['dashboard', 'userNotification'], state);
const bulkOrderPageType = state => R.pathOr('', ['dashboard', 'pageType'], state);
const getModReversalReasons = state => R.pathOr({}, ['dashboard', 'modReversalReasons'], state);
const getResolutionData = state => R.pathOr({}, ['dashboard', 'resolutionData'], state);
const getTrialResponse = state => R.pathOr({}, ['dashboard', 'trialClosingResponse'], state);
const disableTrialTaskButton = state => R.pathOr(false, ['dashboard', 'disableTrialTaskButton'], state);
const getUploadedFile = state => R.pathOr(null, ['dashboard', 'excelParsedData'], state);
const isFileDeleted = state => R.pathOr('', ['dashboard', 'isFileDeleted'], state);
const getFileSubmitResponse = state => R.pathOr({}, ['dashboard', 'fileSubmitResponse'], state);
const getSendToCoviusResponse = state => R.pathOr({}, ['dashboard', 'sendToCoviusResponse'], state);
const getDownloadResponse = state => R.pathOr({}, ['dashboard', 'downloadResponse'], state);
const getcoviusEventOptions = state => R.pathOr([], ['dashboard', 'coviusEventOptions'], state);
const getInvestorEvents = state => R.pathOr([], ['dashboard', 'investorEventOptions'], state);
const getCoviusTabIndex = state => R.pathOr(0, ['dashboard', 'coviusTabIndex'], state);
const getDisablePushData = state => R.pathOr(false, ['dashboard', 'disablePushData'], state);

const getWidgetLoan = state => R.pathOr({}, ['dashboard', 'widgetLoan'], state);
const getEvalCaseDetails = state => R.pathOr([], ['dashboard', 'evalCaseDetails'], state);
const getRootTaskId = R.pathOr('', ['dashboard', 'rootTaskId']);
const getSelectedChecklistId = state => R.pathOr('', ['dashboard', 'selectedChecklistId'], state);
const getProcessId = R.pathOr(null, ['dashboard', 'processId']);


const getAssigntomeBtnStats = R.pathOr(false, ['dashboard', 'disableAssigntomeBtn']);


const getIsPaymentDeferral = R.pathOr(false, ['dashboard', 'isPaymentDeferral']);

const getPopupData = R.pathOr(false, ['dashboard', 'popupData']);

const isIncomeVerification = R.pathOr(false, ['dashboard', 'isIncomeVerification']);
const getCaseDetails = R.pathOr([], ['dashboard', 'caseDetails']);

const getEvalIndex = state => R.pathOr(0, ['dashboard', 'evalIndex'], state);

const getUserNotification = state => R.pathOr(0, ['dashboard', 'userNotification'], state);
const eligibleData = state => R.pathOr([], ['dashboard', 'eligibleData'], state);

const getRequestTypeData = state => R.pathOr('', ['dashboard', 'setRequestTypeData'], state);

const getEvalStatus = state => R.pathOr([], ['dashboard', 'evalStatusData'], state);

const selectors = {
  getUserNotification,
  isIncomeVerification,
  getPopupData,
  getIsPaymentDeferral,
  getBookingTaskId,
  getProcessId,
  userNotification,
  getRootTaskId,
  getSelectedChecklistId,
  getCoviusTabIndex,
  getWidgetLoan,
  getSendToCoviusResponse,
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
  isGetNextError,
  getNextError,
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
  resultOperation,
  tableData,
  evalData,
  wasSearched,
  enableSendToDocGen,
  bulkOrderPageType,
  enableSendToDocsIn,
  enableSendToBooking,
  enableSendToUW,
  getRejectResponse,
  searchLoanTaskResponse,
  stagerTaskName,
  stagerValueState,
  getModReversalReasons,
  isPostModEndShift,
  incentiveTaskCodes,
  getResolutionData,
  completeReviewResponse,
  showCompleteMyReview,
  getTrialResponse,
  disableTrialTaskButton,
  resultData,
  getUploadedFile,
  isFileDeleted,
  brand,
  getFileSubmitResponse,
  getDownloadResponse,
  getcoviusEventOptions,
  disableSendToFEUW,
  getDisablePushData,
  getAssigntomeBtnStats,
  getSelectedWidget,
  errorBanner,
  enableLockButton,
  showBanner,
  getEvalCaseDetails,
  getCaseDetails,
  getEvalIndex,
  addInfoEvalId,
  getInvestorEvents,
  getInvestorHierarchy,
  resolutionId,
  eligibleData,
  getRequestTypeData,
  getEvalStatus,
};

export default selectors;

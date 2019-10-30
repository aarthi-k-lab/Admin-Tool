import {
  autoSave,
  displayAssign,
  dispositionSave,
  dispositionSelect,
  endShift,
  onExpandView,
  clearDisposition,
  clearFirstVisit,
  getNext,
  searchLoan,
  selectEval,
  unassignLoan,
  assignLoan,
  hideAssignUnassign,
  postComment,
  clearBEDisposition,
  getGroupName,
  validateDisposition,
  loadTrialsAction,
  onSentToUnderwritingAction,
  onSendToDocGenAction,
  onSendToDocsInAction,
  cleanResult,
  continueMyReview,
  onLoansSubmitAction,
  onLoanValidationError,
  setBeginSearchAction,
  pageType,
  clearUserNotifyMsg,
  selectReject,
  clearSelectReject,
  onSearchLoanWithTaskAction,
} from './actions';

const onExpand = dispatch => () => dispatch(onExpandView());

const onDispositionSave = dispatch => (dispositionPayload) => {
  dispatch(dispositionSave(dispositionPayload));
};

const validateDispositionTrigger = dispatch => (dispositionPayload) => {
  dispatch(validateDisposition(dispositionPayload));
};

const onPostComment = dispatch => (commentsPayload) => {
  dispatch(postComment(commentsPayload));
};

const onDispositionSelect = dispatch => (dispositionPayload) => {
  dispatch(dispositionSelect(dispositionPayload));
};

const onClearDisposition = dispatch => () => dispatch(clearDisposition());

const onAutoSave = dispatch => (taskStatus) => {
  dispatch(autoSave(taskStatus));
};

const onGetNext = dispatch => (payload) => {
  dispatch(clearFirstVisit());
  dispatch(clearBEDisposition());
  dispatch(clearDisposition());
  dispatch(getNext(payload));
};

const onClearBEDisposition = dispatch => () => {
  dispatch(clearBEDisposition());
};

const onSelectEval = dispatch => (payload) => {
  dispatch(clearFirstVisit());
  dispatch(clearDisposition());
  dispatch(selectEval(payload));
};

const onEndShift = dispatch => (type) => {
  dispatch(endShift(type));
};

const onUnassignLoan = dispatch => () => {
  dispatch(unassignLoan());
};

const onAssignLoan = dispatch => () => {
  dispatch(assignLoan());
};

const onSearchLoan = dispatch => (loanNumber) => {
  dispatch(searchLoan(loanNumber));
};

const setBeginSearch = dispatch => () => {
  dispatch(setBeginSearchAction());
};

const onDialogClose = dispatch => () => {
  dispatch(hideAssignUnassign());
};

const onUnassignSuccess = dispatch => () => {
  dispatch(displayAssign());
};

const onGetGroupName = dispatch => (payload) => {
  dispatch(getGroupName(payload));
};

const loadTrials = dispatch => evalId => dispatch(loadTrialsAction(evalId));

const onSentToUnderwriting = dispatch => () => {
  dispatch(onSentToUnderwritingAction());
};

const onSendToDocGen = dispatch => isStager => dispatch(onSendToDocGenAction(isStager));

const onSendToDocsIn = dispatch => () => dispatch(onSendToDocsInAction());

const onCleanResult = dispatch => () => dispatch(cleanResult());
const onContinueMyReview = dispatch => (taskStatus) => {
  dispatch(continueMyReview(taskStatus));
};

const onLoansSubmit = dispatch => (payload) => {
  dispatch(onLoansSubmitAction(payload));
};
const onFailedLoanValidation = dispatch => (payload) => {
  dispatch(onLoanValidationError(payload));
};

const setPageType = dispatch => (payload) => {
  dispatch(pageType(payload));
};
const onLoansSubmitStager = dispatch => (payload) => {
  dispatch(onLoansSubmitAction(payload));
};
const onClearUserNotifyMsg = dispatch => () => {
  dispatch(clearUserNotifyMsg());
};

const onSelectReject = dispatch => (payload) => {
  dispatch(selectReject(payload));
};

const onClearSelectReject = dispatch => () => {
  dispatch(clearSelectReject());
};

const onSearchLoanWithTask = dispatch => (payload) => {
  dispatch(onSearchLoanWithTaskAction(payload));
};

const operations = {
  onAutoSave,
  onClearDisposition,
  onExpand,
  onEndShift,
  onDispositionSave,
  onDispositionSelect,
  onGetNext,
  onSearchLoan,
  onSelectEval,
  onUnassignLoan,
  onUnassignSuccess,
  onAssignLoan,
  onDialogClose,
  onPostComment,
  onClearBEDisposition,
  onGetGroupName,
  validateDispositionTrigger,
  loadTrials,
  onSentToUnderwriting,
  onSendToDocGen,
  onSendToDocsIn,
  onCleanResult,
  onContinueMyReview,
  onLoansSubmit,
  onFailedLoanValidation,
  setBeginSearch,
  setPageType,
  onLoansSubmitStager,
  onClearUserNotifyMsg,
  onSelectReject,
  onClearSelectReject,
  onSearchLoanWithTask,
};

export default operations;

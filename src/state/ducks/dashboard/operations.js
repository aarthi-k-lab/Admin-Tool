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
  continueMyReview,
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

const onContinueMyReview = dispatch => (taskStatus) => {
  dispatch(continueMyReview(taskStatus));
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
  onContinueMyReview,
};

export default operations;

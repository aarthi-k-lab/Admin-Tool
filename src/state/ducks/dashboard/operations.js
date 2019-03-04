import {
  autoSave,
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
  beDispositionSelect,
  hideAssignUnassign,
  clearBEDisposition,
  getGroupName,
} from './actions';

const onExpand = dispatch => () => dispatch(onExpandView());

const onDispositionSave = dispatch => (dispositionPayload) => {
  dispatch(dispositionSave(dispositionPayload));
};

const onDispositionSelect = dispatch => (dispositionPayload) => {
  dispatch(dispositionSelect(dispositionPayload));
};

const onClearDisposition = dispatch => () => dispatch(clearDisposition());

const onAutoSave = dispatch => (taskStatus) => {
  dispatch(autoSave(taskStatus));
};

const onSelectDisposition = dispatch => (payload) => {
  dispatch(beDispositionSelect(payload));
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

const onEndShift = dispatch => () => {
  dispatch(endShift());
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

const onGetGroupName = dispatch => (payload) => {
  dispatch(getGroupName(payload));
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
  onAssignLoan,
  onSelectDisposition,
  onDialogClose,
  onClearBEDisposition,
  onGetGroupName,
};

export default operations;

import {
  autoSave,
  dispositionSave,
  dispositionSelect,
  endShift,
  onExpandView,
  clearDisposition,
  clearFirstVisit,
  getNext,
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

const onGetNext = dispatch => () => {
  dispatch(clearFirstVisit());
  dispatch(clearDisposition());
  dispatch(getNext());
};

const onEndShift = dispatch => () => {
  dispatch(endShift());
};

const operations = {
  onAutoSave,
  onClearDisposition,
  onExpand,
  onEndShift,
  onDispositionSave,
  onDispositionSelect,
  onGetNext,
};

export default operations;

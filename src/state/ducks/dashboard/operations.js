import {
  autoSave,
  dispositionSave,
  dispositionSelect,
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

const onAutoSave = dispatch => () => dispatch(autoSave());

const onGetNext = dispatch => () => {
  dispatch(clearFirstVisit());
  dispatch(clearDisposition());
  dispatch(getNext());
};

const operations = {
  onAutoSave,
  onClearDisposition,
  onExpand,
  onDispositionSave,
  onDispositionSelect,
  onGetNext,
};

export default operations;

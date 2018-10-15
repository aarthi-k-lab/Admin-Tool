import {
  dispositionSave,
  onExpandView,
  clearDisposition,
  clearFirstVisit,
  getNext,
} from './actions';

const onExpand = dispatch => () => dispatch(onExpandView());

const onDispositionSave = dispatch => (dispositionPayload) => {
  dispatch(dispositionSave(dispositionPayload));
};

const onClearDisposition = dispatch => () => dispatch(clearDisposition());

const onGetNext = dispatch => () => {
  dispatch(clearFirstVisit());
  dispatch(getNext());
};

const operations = {
  onClearDisposition,
  onExpand,
  onDispositionSave,
  onGetNext,
};

export default operations;

import { dispositionSave, onExpandView, clearDisposition } from './actions';

const onExpand = dispatch => () => dispatch(onExpandView());

const onDispositionSave = dispatch => (dispositionPayload) => {
  dispatch(dispositionSave(dispositionPayload));
};

const onClearDisposition = dispatch => () => dispatch(clearDisposition());

const operations = {
  onClearDisposition,
  onExpand,
  onDispositionSave,
};

export default operations;

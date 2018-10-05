import { SET_EXPAND_VIEW_SAGA, SAVE_DISPOSITION_SAGA, CLEAR_DISPOSITION } from './types';

const onExpandView = userPayload => ({
  type: SET_EXPAND_VIEW_SAGA,
  payload: userPayload,
});

const dispositionSave = dispositionPayload => ({
  type: SAVE_DISPOSITION_SAGA,
  payload: dispositionPayload,
});

const clearDisposition = () => ({
  type: CLEAR_DISPOSITION,
});

export {
  clearDisposition,
  dispositionSave,
  onExpandView,
};

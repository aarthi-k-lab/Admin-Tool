import {
  GET_NEXT,
  SET_EXPAND_VIEW_SAGA,
  SAVE_DISPOSITION_SAGA,
  CLEAR_DISPOSITION,
  CLEAR_FIRST_VISIT,
} from './types';

const onExpandView = userPayload => ({
  type: SET_EXPAND_VIEW_SAGA,
  payload: userPayload,
});

const dispositionSave = dispositionPayload => ({
  type: SAVE_DISPOSITION_SAGA,
  payload: dispositionPayload,
});

const getNext = () => ({
  type: GET_NEXT,
});

const clearDisposition = () => ({
  type: CLEAR_DISPOSITION,
});

const clearFirstVisit = () => ({
  type: CLEAR_FIRST_VISIT,
});

export {
  clearDisposition,
  clearFirstVisit,
  dispositionSave,
  getNext,
  onExpandView,
};

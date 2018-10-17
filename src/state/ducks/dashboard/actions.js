import {
  AUTO_SAVE_TRIGGER,
  GET_NEXT,
  SET_EXPAND_VIEW_SAGA,
  SAVE_DISPOSITION_SAGA,
  SAVE_SELECTED_DISPOSITION,
  CLEAR_DISPOSITION,
  CLEAR_FIRST_VISIT,
} from './types';

const onExpandView = userPayload => ({
  type: SET_EXPAND_VIEW_SAGA,
  payload: userPayload,
});

const autoSave = () => ({
  type: AUTO_SAVE_TRIGGER,
});

const dispositionSave = dispositionPayload => ({
  type: SAVE_DISPOSITION_SAGA,
  payload: dispositionPayload,
});

const dispositionSelect = dispositionPayload => ({
  type: SAVE_SELECTED_DISPOSITION,
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
  autoSave,
  clearDisposition,
  clearFirstVisit,
  dispositionSave,
  dispositionSelect,
  getNext,
  onExpandView,
};

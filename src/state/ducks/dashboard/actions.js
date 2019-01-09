import { ERROR_LOADING_TOMBSTONE_DATA } from 'ducks/tombstone/types';
import {
  AUTO_SAVE_OPERATIONS,
  END_SHIFT,
  GET_NEXT,
  SET_EXPAND_VIEW_SAGA,
  SAVE_DISPOSITION_SAGA,
  SAVE_SELECTED_DISPOSITION,
  CLEAR_DISPOSITION,
  CLEAR_FIRST_VISIT,
  CLEAR_TASK_DETAILS,
} from './types';


const onExpandView = userPayload => ({
  type: SET_EXPAND_VIEW_SAGA,
  payload: userPayload,
});

const autoSave = taskStatus => ({
  type: AUTO_SAVE_OPERATIONS,
  payload: taskStatus,
});

const dispositionSave = dispositionPayload => ({
  type: SAVE_DISPOSITION_SAGA,
  payload: dispositionPayload,
});

const dispositionSelect = dispositionPayload => ({
  type: SAVE_SELECTED_DISPOSITION,
  payload: dispositionPayload,
});

const errorTombstoneFetch = () => (
  {
    type: ERROR_LOADING_TOMBSTONE_DATA,
    payload: { data: [], error: true, loading: false },
  });

const getNext = () => ({
  type: GET_NEXT,
});

const endShift = () => ({
  type: END_SHIFT,
});

const clearDisposition = () => ({
  type: CLEAR_DISPOSITION,
});

const clearTaskDetails = () => ({
  type: CLEAR_TASK_DETAILS,
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
  endShift,
  errorTombstoneFetch,
  getNext,
  onExpandView,
  clearTaskDetails,
};

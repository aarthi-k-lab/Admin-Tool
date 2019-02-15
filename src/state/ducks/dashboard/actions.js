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
  SEARCH_LOAN_TRIGGER,
  SAVE_EVALID_LOANNUMBER,
  UNASSIGN_LOAN,
  ASSIGN_LOAN,
  SAVE_SELECTED_BE_DISPOSITION,
  HIDE_ASSIGN_UNASSIGN,
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

const beDispositionSelect = beDispositionPayload => ({
  type: SAVE_SELECTED_BE_DISPOSITION,
  payload: beDispositionPayload,
});

const errorTombstoneFetch = () => (
  {
    type: ERROR_LOADING_TOMBSTONE_DATA,
    payload: { data: [], error: true, loading: false },
  });

const getNext = () => ({
  type: GET_NEXT,
});

const selectEval = payload => ({
  type: SAVE_EVALID_LOANNUMBER,
  payload,
});

const endShift = () => ({
  type: END_SHIFT,
});

const unassignLoan = () => ({
  type: UNASSIGN_LOAN,
});

const assignLoan = () => ({
  type: ASSIGN_LOAN,
});

const clearDisposition = () => ({
  type: CLEAR_DISPOSITION,
});

const clearFirstVisit = () => ({
  type: CLEAR_FIRST_VISIT,
});

const searchLoan = loanNumber => ({
  type: SEARCH_LOAN_TRIGGER,
  payload: loanNumber,
});

const hideAssignUnassign = () => ({
  type: HIDE_ASSIGN_UNASSIGN,
});


export {
  autoSave,
  beDispositionSelect,
  clearDisposition,
  clearFirstVisit,
  dispositionSave,
  dispositionSelect,
  endShift,
  errorTombstoneFetch,
  getNext,
  onExpandView,
  searchLoan,
  selectEval,
  unassignLoan,
  assignLoan,
  hideAssignUnassign,
};

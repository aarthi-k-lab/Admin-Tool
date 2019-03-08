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
  HIDE_ASSIGN_UNASSIGN,
  POST_COMMENT,
  CLEAR_BE_DISPOSITION,
  GROUP_NAME,
  SAVE_LOANNUMBER_PROCESSID,
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

const getNext = payload => ({
  type: GET_NEXT,
  payload,
});

const selectEval = payload => ({
  type: SAVE_EVALID_LOANNUMBER,
  payload,
});

const selectProcessId = payload => ({
  type: SAVE_LOANNUMBER_PROCESSID,
  payload,
});

const getGroupName = payload => ({
  type: GROUP_NAME,
  payload,
});

const endShift = () => ({
  type: END_SHIFT,
});

const unassignLoan = () => ({
  type: UNASSIGN_LOAN,
});

const postComment = payload => ({
  type: POST_COMMENT,
  payload,
});

const assignLoan = () => ({
  type: ASSIGN_LOAN,
});

const clearDisposition = () => ({
  type: CLEAR_DISPOSITION,
});

const clearBEDisposition = () => ({
  type: CLEAR_BE_DISPOSITION,
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
  selectProcessId,
  unassignLoan,
  assignLoan,
  hideAssignUnassign,
  postComment,
  clearBEDisposition,
  getGroupName,
};

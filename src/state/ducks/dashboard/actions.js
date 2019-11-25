import { ERROR_LOADING_TOMBSTONE_DATA } from 'ducks/tombstone/types';
import EndShift from 'models/EndShift';
import {
  AUTO_SAVE_OPERATIONS,
  END_SHIFT,
  GET_NEXT,
  DISPLAY_ASSIGN,
  SET_EXPAND_VIEW_SAGA,
  SAVE_DISPOSITION_SAGA,
  SAVE_SELECTED_DISPOSITION,
  CLEAR_DISPOSITION,
  CLEAR_FIRST_VISIT,
  SEARCH_LOAN_TRIGGER,
  SEARCH_SELECT_EVAL,
  UNASSIGN_LOAN,
  ASSIGN_LOAN,
  HIDE_ASSIGN_UNASSIGN,
  POST_COMMENT,
  CLEAR_BE_DISPOSITION,
  GROUP_NAME,
  SAVE_LOANNUMBER_PROCESSID,
  VALIDATE_DISPOSITION_SAGA,
  // GET_LOAN_ACTIVITY_DETAILS,
  LOAD_TRIALS_SAGA,
  SET_TASK_UNDERWRITING,
  SET_TASK_SENDTO_DOCGEN,
  SET_TASK_SENDTO_DOCSIN,
  CLEAN_RESULT,
  CONTINUE_MY_REVIEW,
  SET_ADD_DOCS_IN,
  SET_RESULT_OPERATION,
  SET_BEGIN_SEARCH,
  SET_BULK_UPLOAD_PAGE_TYPE,
  CLEAR_USER_NOTIF_MSG,
  SELECT_REJECT_SAGA,
  CLEAR_SELECT_REJECT,
  SEARCH_LOAN_WITH_TASK_SAGA,
  SET_STAGER_VALUE_STATE,
  SET_STAGER_TASK_NAME,
  MOD_REVERSAL_REASONS,
  CLEAR_POSTMOD_END_SHIFT,
  CLEAR_BULKUPLOAD_TABLEDATA,
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

const validateDisposition = dispositionPayload => ({
  type: VALIDATE_DISPOSITION_SAGA,
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
  type: SEARCH_SELECT_EVAL,
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

const endShift = (type = EndShift.SAVE_DISPOSITION_AND_CLEAR_DASHBOARD_DATA) => ({
  type: END_SHIFT,
  payload: {
    type,
  },
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

const setBeginSearchAction = () => ({
  type: SET_BEGIN_SEARCH,
});

const displayAssign = () => ({
  type: DISPLAY_ASSIGN,
});

const loadTrialsAction = evalId => ({
  type: LOAD_TRIALS_SAGA,
  payload: evalId,
});

const onSentToUnderwritingAction = () => ({
  type: SET_TASK_UNDERWRITING,
});

const clearBulkUploadDataAction = () => ({
  type: CLEAR_BULKUPLOAD_TABLEDATA,
});

const saveStagerTaskName = stagerTaskName => ({
  type: SET_STAGER_TASK_NAME,
  payload: stagerTaskName,
});

const saveStagerValueAndState = payload => ({
  type: SET_STAGER_VALUE_STATE,
  payload,
});

const onSendToDocGenAction = isStager => ({
  type: SET_TASK_SENDTO_DOCGEN,
  payload: isStager,
});

const onSendToDocsInAction = () => ({
  type: SET_TASK_SENDTO_DOCSIN,
});

const cleanResult = () => ({
  type: CLEAN_RESULT,
});
const continueMyReview = taskStatus => ({
  type: CONTINUE_MY_REVIEW,
  payload: taskStatus,
});

const onLoansSubmitAction = payload => ({
  type: SET_ADD_DOCS_IN,
  payload,
});
const onLoanValidationError = payload => ({
  type: SET_RESULT_OPERATION,
  payload,
});
const pageType = pageName => ({
  type: SET_BULK_UPLOAD_PAGE_TYPE,
  payload: pageName,
});

const clearUserNotifyMsg = () => ({
  type: CLEAR_USER_NOTIF_MSG,
});

const selectReject = payload => ({
  type: SELECT_REJECT_SAGA,
  payload,
});

const clearSelectReject = () => ({
  type: CLEAR_SELECT_REJECT,
});

const onSearchLoanWithTaskAction = payload => ({
  type: SEARCH_LOAN_WITH_TASK_SAGA,
  payload,
});

const onSelectModReversal = () => ({
  type: MOD_REVERSAL_REASONS,
});

const clearPostModEndShitf = () => ({
  type: CLEAR_POSTMOD_END_SHIFT,
});


export {
  autoSave,
  clearDisposition,
  clearFirstVisit,
  displayAssign,
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
  validateDisposition,
  loadTrialsAction,
  onSentToUnderwritingAction,
  onSendToDocGenAction,
  onSendToDocsInAction,
  cleanResult,
  continueMyReview,
  onLoansSubmitAction,
  onLoanValidationError,
  setBeginSearchAction,
  pageType,
  clearUserNotifyMsg,
  selectReject,
  clearSelectReject,
  onSearchLoanWithTaskAction,
  saveStagerTaskName,
  saveStagerValueAndState,
  onSelectModReversal,
  clearPostModEndShitf,
  clearBulkUploadDataAction,
};

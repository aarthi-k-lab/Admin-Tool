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
  ASSIGN_TO_ME_CLICK,
  HIDE_ASSIGN_UNASSIGN,
  POST_COMMENT,
  CLEAR_BE_DISPOSITION,
  GROUP_NAME,
  SAVE_LOANNUMBER_PROCESSID,
  VALIDATE_DISPOSITION_SAGA,
  SEND_TO_FEUW_SAGA,
  // GET_LOAN_ACTIVITY_DETAILS,
  LOAD_TRIALS_SAGA,
  SET_TASK_UNDERWRITING,
  SET_TASK_SENDTO_DOCGEN,
  SET_TASK_SENDTO_DOCSIN,
  SET_TASK_SENDTO_BOOKING,
  CLEAN_RESULT,
  CONTINUE_MY_REVIEW,
  COMPLETE_MY_REVIEW,
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
  CLEAR_DATA,
  CLEAR_BULKUPLOAD_TABLEDATA,
  TRIAL_TASK,
  INSERT_EVALID,
  PROCESS_COVIUS_BULK,
  DISCARD_EVAL_RESPONSE,
  PROCESS_FILE,
  DELETE_FILE,
  SUBMIT_FILE,
  CLEAR_COVIUS_SUBMIT_DATA,
  DOWNLOAD_FILE,
  POPULATE_EVENTS_DROPDOWN,
  SEND_TO_COVIUS,
  CLOSE_SWEET_ALERT,
  SET_COVIUS_TABINDEX,
  ASSIGN_BOOKING_LOAN,
  UNASSIGN_BOOKING_LOAN,
  SET_PAYMENT_DEFERRAL,
  SET_SELECTED_WIDGET,
  CLEAR_POPUP_DATA,
  TOGGLE_INCVRFN,
  FETCH_EVAL_CASE,
  EVAL_ROW_CLICK,
  SET_TOMBSTONE_DATA_FOR_LOANVIEW,
  PROCESS_FHLMC_RESOSLVE_BULK,
  POPULATE_INVESTOR_EVENTS_DROPDOWN,
  SUBMIT_TO_FHLMC,
  DISMISS_USER_NOTIFICATION,
  SHOW_LOADER,
  HIDE_LOADER,
  SET_REQUEST_TYPE_DATA,
  SET_EVALID,
  GET_FHLMC_MOD_HISTORY,
  CLEAR_POPUP_TABLE_DATA,
} from './types';


const toggleIncomeVerification = visibility => ({
  type: TOGGLE_INCVRFN,
  payload: visibility,
});


const onClearPopupDataAction = () => ({
  type: CLEAR_POPUP_DATA,
});

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

const setTombstoneData = payload => ({
  type: SET_TOMBSTONE_DATA_FOR_LOANVIEW,
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

const assignBookingLoan = payload => ({
  type: ASSIGN_BOOKING_LOAN,
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

const unassignBookingLoan = () => ({
  type: UNASSIGN_BOOKING_LOAN,
});

const postComment = payload => ({
  type: POST_COMMENT,
  payload,
});

const assignLoan = () => ({
  type: ASSIGN_LOAN,
});

const assignToMeClick = payload => ({
  type: ASSIGN_TO_ME_CLICK,
  payload,
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

const onFhlmcCasesBulkSubmit = payload => ({
  type: PROCESS_FHLMC_RESOSLVE_BULK,
  payload,
});

const onFHLMCModHistoryPopup = () => ({
  type: GET_FHLMC_MOD_HISTORY,
});

const onTablePopupClose = () => ({
  type: CLEAR_POPUP_TABLE_DATA,
});

const onSubmitToFhlmcAction = (selectedRequestType, portfolioCode) => ({
  type: SUBMIT_TO_FHLMC,
  payload: {
    selectedRequestType,
    portfolioCode,
  },
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

const onSendToBookingAction = () => ({
  type: SET_TASK_SENDTO_BOOKING,
});

const cleanResult = () => ({
  type: CLEAN_RESULT,
});
const continueMyReview = taskStatus => ({
  type: CONTINUE_MY_REVIEW,
  payload: taskStatus,
});

const completeMyReview = disposition => ({
  type: COMPLETE_MY_REVIEW,
  payload: disposition,
});

const onEvalSubmitAction = payload => ({
  type: SET_EVALID,
  payload,
});

const onLoansSubmitAction = payload => ({
  type: SET_ADD_DOCS_IN,
  payload,
});

const onCoviusBulkSubmit = payload => ({
  type: PROCESS_COVIUS_BULK,
  payload,
});

const onLoanValidationError = payload => ({
  type: SET_RESULT_OPERATION,
  payload,
});

const onEvalValidationError = payload => ({
  type: SET_RESULT_OPERATION,
  payload,
});

const onEvalInsertionAction = payload => ({
  type: INSERT_EVALID,
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

const clearData = () => ({
  type: CLEAR_DATA,
});

const onTrialTaskAction = payload => ({
  type: TRIAL_TASK,
  payload,
});

const discardEvalResponse = () => ({
  type: DISCARD_EVAL_RESPONSE,
});

const processFileAction = payload => ({
  type: PROCESS_FILE,
  payload,
});

const deleteFileAction = payload => ({
  type: DELETE_FILE,
  payload,
});

const submitFileAction = () => ({
  type: SUBMIT_FILE,
});

const clearSubmitCoviusData = () => ({
  type: CLEAR_COVIUS_SUBMIT_DATA,
});

const downloadFileAction = payload => ({
  type: DOWNLOAD_FILE,
  payload,
});

const populateEventsDropdown = () => ({
  type: POPULATE_EVENTS_DROPDOWN,
});

const populateInvestorEventsDropdown = () => ({
  type: POPULATE_INVESTOR_EVENTS_DROPDOWN,
});

const submitToCoviusAction = payload => ({
  type: SEND_TO_COVIUS,
  payload,
});

const sendToFEUW = payload => ({
  type: SEND_TO_FEUW_SAGA,
  payload,
});

const closeSweetAlertAction = () => ({
  type: CLOSE_SWEET_ALERT,
});

const openSweetAlertAction = payload => ({
  type: SET_RESULT_OPERATION,
  payload,
});

const setCoviusIndexAction = payload => ({
  type: SET_COVIUS_TABINDEX,
  payload,
});

const setSelectedWidgets = payload => ({
  type: SET_SELECTED_WIDGET,
  payload,
});

const setPaymentDeferral = payload => ({
  type: SET_PAYMENT_DEFERRAL,
  payload,
});

const additionalInfo = loanNumber => ({
  type: FETCH_EVAL_CASE,
  payload: loanNumber,
});

const evalSelectRow = payload => ({
  type: EVAL_ROW_CLICK,
  payload,
});

const showLoader = () => ({
  type: SHOW_LOADER,
});

const hideLoader = () => ({
  type: HIDE_LOADER,
});

const dismissUserNotification = () => ({
  type: DISMISS_USER_NOTIFICATION,
});

const setRequestTypeDataAction = payload => ({
  type: SET_REQUEST_TYPE_DATA,
  payload,
});


export {
  dismissUserNotification,
  onSubmitToFhlmcAction,
  showLoader,
  hideLoader,
  setPaymentDeferral,
  unassignBookingLoan,
  setCoviusIndexAction,
  openSweetAlertAction,
  closeSweetAlertAction,
  submitToCoviusAction,
  autoSave,
  discardEvalResponse,
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
  setTombstoneData,
  selectProcessId,
  unassignLoan,
  assignLoan,
  assignToMeClick,
  hideAssignUnassign,
  postComment,
  clearBEDisposition,
  clearData,
  getGroupName,
  validateDisposition,
  loadTrialsAction,
  onSentToUnderwritingAction,
  populateInvestorEventsDropdown,
  onSendToDocGenAction,
  onSendToDocsInAction,
  onSendToBookingAction,
  cleanResult,
  continueMyReview,
  completeMyReview,
  onEvalSubmitAction,
  onLoansSubmitAction,
  onLoanValidationError,
  onEvalValidationError,
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
  onTrialTaskAction,
  onEvalInsertionAction,
  onCoviusBulkSubmit,
  processFileAction,
  deleteFileAction,
  submitFileAction,
  clearSubmitCoviusData,
  downloadFileAction,
  populateEventsDropdown,
  sendToFEUW,
  setSelectedWidgets,
  onClearPopupDataAction,
  toggleIncomeVerification,
  assignBookingLoan,
  additionalInfo,
  evalSelectRow,
  onFHLMCModHistoryPopup,
  onTablePopupClose,
  onFhlmcCasesBulkSubmit,
  setRequestTypeDataAction,
};

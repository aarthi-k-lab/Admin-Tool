import {
  autoSave,
  displayAssign,
  dispositionSave,
  dispositionSelect,
  endShift,
  onExpandView,
  clearDisposition,
  clearData,
  clearFirstVisit,
  getNext,
  searchLoan,
  selectEval,
  unassignLoan,
  assignLoan,
  assignToMeClick,
  hideAssignUnassign,
  postComment,
  clearBEDisposition,
  getGroupName,
  validateDisposition,
  loadTrialsAction,
  onSentToUnderwritingAction,
  onSendToDocGenAction,
  onSendToDocsInAction,
  onSendToBookingAction,
  cleanResult,
  continueMyReview,
  completeMyReview,
  onEvalSubmitAction,
  onLoansSubmitAction,
  onEvalValidationError,
  onLoanValidationError,
  setBeginSearchAction,
  pageType,
  clearUserNotifyMsg,
  selectReject,
  clearSelectReject,
  onSearchLoanWithTaskAction,
  saveStagerValueAndState,
  saveStagerTaskName,
  onSelectModReversal,
  clearPostModEndShitf,
  clearBulkUploadDataAction,
  onTrialTaskAction,
  onEvalInsertionAction,
  onCoviusBulkSubmit,
  discardEvalResponse,
  processFileAction,
  deleteFileAction,
  submitFileAction,
  clearSubmitCoviusData,
  downloadFileAction,
  populateEventsDropdown,
  sendToFEUW,
  submitToCoviusAction,
  openSweetAlertAction,
  closeSweetAlertAction,
  setCoviusIndexAction,
  setSelectedWidgets,
  onClearPopupDataAction,
  toggleIncomeVerification,
  additionalInfo,
  assignBookingLoan,
  evalSelectRow,
  setTombstoneData,
  onFhlmcCasesBulkSubmit,
  populateInvestorEventsDropdown,
  onSubmitToFhlmcAction,
  dismissUserNotification,
  unassignBookingLoan,
  setRequestTypeDataAction,
  onFHLMCModHistoryPopup,
  onTablePopupClose,
  checkTrialDisableStagerButtonAction,
  onSentToBoardingAction,
  getCancellationReasons,
  setSelectedCancellationReason,
  clearCancellationDetails,
  setExceptionReviewIndicatorAction,
  setExceptionReviewCommentsAction,
  getCaseIdsAction,
  setEnquiryCaseIdAction,
  setTrialDateInfoAction,
  onUpdateTrialPeriodAction,
  odmRerunAction,
  disableSaveAction,
  enableLockButton,
  dashboardResetDataAction,
} from './actions';

import {
  resetWidgetData,
} from '../widgets/actions';
import {
  resetIncomeChecklistData,
  processValidations,
} from '../income-calculator/actions';
import { storeDelayCheckListHistory } from '../stager/actions';

const onExpand = dispatch => () => dispatch(onExpandView());

const onDispositionSave = dispatch => (dispositionPayload) => {
  dispatch(dispositionSave(dispositionPayload));
};

const validateDispositionTrigger = dispatch => (dispositionPayload) => {
  dispatch(validateDisposition(dispositionPayload));
};

const onPostComment = dispatch => (commentsPayload) => {
  dispatch(postComment(commentsPayload));
};

const onDispositionSelect = dispatch => (dispositionPayload) => {
  dispatch(dispositionSelect(dispositionPayload));
};

const onClearDisposition = dispatch => () => dispatch(clearDisposition());

const onClearPostModEndShitf = dispatch => () => dispatch(clearPostModEndShitf());

const onResetData = dispatch => () => dispatch(clearData());

const onAutoSave = dispatch => (taskStatus) => {
  dispatch(resetWidgetData());
  dispatch(resetIncomeChecklistData());
  dispatch(unassignBookingLoan());
  dispatch(autoSave(taskStatus));
};

const onGetNext = dispatch => (payload) => {
  dispatch(clearFirstVisit());
  dispatch(clearBEDisposition());
  dispatch(clearDisposition());
  dispatch(storeDelayCheckListHistory([]));
  dispatch(getNext(payload));
};

const setStagerTaskName = dispatch => (payload) => {
  dispatch(saveStagerTaskName(payload));
};

const setStagerValueAndState = dispatch => (payload) => {
  dispatch(saveStagerValueAndState(payload));
};

const onClearBulkUploadDataAction = dispatch => (payload) => {
  dispatch(clearBulkUploadDataAction(payload));
};

const onClearStagerTaskName = dispatch => () => {
  dispatch(saveStagerTaskName({}));
};

const onClearBEDisposition = dispatch => () => {
  dispatch(clearBEDisposition());
};

const onSelectEval = dispatch => (payload) => {
  dispatch(clearFirstVisit());
  dispatch(clearDisposition());
  dispatch(selectEval(payload));
};

const setTombstoneDataForLoanView = dispatch => (payload) => {
  dispatch(setTombstoneData(payload));
};

const onEndShift = dispatch => (type) => {
  dispatch(storeDelayCheckListHistory([]));
  dispatch(endShift(type));
};

const onUnassignLoan = dispatch => () => {
  dispatch(unassignLoan());
};

const onAssignLoan = dispatch => () => {
  dispatch(assignLoan());
};

const onAssignToMeClick = dispatch => (payload) => {
  dispatch(assignToMeClick(payload));
};


const onSearchLoan = dispatch => (loanNumber) => {
  dispatch(searchLoan(loanNumber));
};

const setBeginSearch = dispatch => () => {
  dispatch(setBeginSearchAction());
};

const onDialogClose = dispatch => () => {
  dispatch(hideAssignUnassign());
};

const onUnassignSuccess = dispatch => () => {
  dispatch(displayAssign());
};

const onGetGroupName = dispatch => (payload) => {
  dispatch(getGroupName(payload));
};

const onWidgetClick = dispatch => (payload) => {
  dispatch(assignBookingLoan(payload));
};

const loadTrials = dispatch => evalId => dispatch(loadTrialsAction(evalId));

const onSentToUnderwriting = dispatch => () => {
  dispatch(onSentToUnderwritingAction());
};

const onSendToDocGen = dispatch => isStager => dispatch(onSendToDocGenAction(isStager));

const onSendToDocsIn = dispatch => () => dispatch(onSendToDocsInAction());

const onSendToBooking = dispatch => () => dispatch(onSendToBookingAction());

const onTrialTask = dispatch => (payload) => {
  dispatch(onTrialTaskAction(payload));
};

const onCleanResult = dispatch => () => dispatch(cleanResult());

const onContinueMyReview = dispatch => (taskStatus) => {
  dispatch(continueMyReview(taskStatus));
};

const onEvalInsertion = dispatch => (payload) => {
  dispatch(onEvalInsertionAction(payload));
};

const onCompleteMyReview = dispatch => (disposition) => {
  dispatch(completeMyReview(disposition));
};

const onEvalSubmit = dispatch => (payload) => {
  dispatch(onEvalSubmitAction(payload));
};

const onLoansSubmit = dispatch => (payload) => {
  dispatch(onLoansSubmitAction(payload));
};

const onCoviusCasesSubmit = dispatch => (payload) => {
  dispatch(onCoviusBulkSubmit(payload));
};

const onFHLMCModHistory = dispatch => () => {
  dispatch(onFHLMCModHistoryPopup());
};

const onTablePopupDataClear = dispatch => () => {
  dispatch(onTablePopupClose());
};

const onPopupClose = dispatch => () => {
  dispatch(onClearPopupDataAction());
};

const onFhlmcCasesSubmit = dispatch => (payload) => {
  dispatch(onFhlmcCasesBulkSubmit(payload));
};

const onSubmitToFhlmcRequest = dispatch => (selectedRequestType,
  portfolioCode, sweetAlertPayload) => {
  dispatch(openSweetAlertAction(sweetAlertPayload));
  dispatch(onSubmitToFhlmcAction(selectedRequestType, portfolioCode));
};

const onSentToBoardingTemplateOperation = dispatch => (selectedRequestType,
  portfolioCode, sweetAlertPayload) => {
  dispatch(openSweetAlertAction(sweetAlertPayload));
  dispatch(onSentToBoardingAction(selectedRequestType, portfolioCode));
};
const onFailedLoanValidation = dispatch => (payload) => {
  dispatch(onLoanValidationError(payload));
};

const onFailedEvalValidation = dispatch => (payload) => {
  dispatch(onEvalValidationError(payload));
};

const openSweetAlert = dispatch => (sweetAlertPayload) => {
  dispatch(openSweetAlertAction(sweetAlertPayload));
};

const setPageType = dispatch => (payload) => {
  dispatch(pageType(payload));
};
const onLoansSubmitStager = dispatch => (payload) => {
  dispatch(onLoansSubmitAction(payload));
};
const onClearUserNotifyMsg = dispatch => () => {
  dispatch(clearUserNotifyMsg());
};

const onSelectReject = dispatch => (payload) => {
  dispatch(selectReject(payload));
};

const onClearSelectReject = dispatch => () => {
  dispatch(clearSelectReject());
};

const onSearchLoanWithTask = dispatch => (payload) => {
  dispatch(onSearchLoanWithTaskAction(payload));
};

const selectModReversal = dispatch => () => {
  dispatch(onSelectModReversal());
};

const clearEvalResponse = dispatch => () => dispatch(discardEvalResponse());

const onProcessFile = dispatch => (payload) => {
  dispatch(processFileAction(payload));
};

const onDeleteFile = dispatch => (payload) => {
  dispatch(deleteFileAction(payload));
};

const onSubmitFile = dispatch => (sweetAlertPayload) => {
  dispatch(openSweetAlertAction(sweetAlertPayload));
  dispatch(submitFileAction());
};

const onClearSubmitCoviusData = dispatch => () => {
  dispatch(clearSubmitCoviusData());
};

const onSendToFEUW = dispatch => (payload) => {
  dispatch(sendToFEUW(payload));
};

const downloadFile = dispatch => (payload) => {
  dispatch(downloadFileAction(payload));
};

const populateEvents = dispatch => () => {
  dispatch(populateEventsDropdown());
};

const populateInvestorEvents = dispatch => (payload) => {
  dispatch(populateInvestorEventsDropdown(payload));
};

const submitToCovius = dispatch => (eventCode, sweetAlertPayload) => {
  dispatch(openSweetAlertAction(sweetAlertPayload));
  dispatch(submitToCoviusAction(eventCode));
};

const closeSweetAlert = dispatch => () => {
  dispatch(closeSweetAlertAction());
};

const setCoviusIndex = dispatch => (payload) => {
  dispatch(setCoviusIndexAction(payload));
};

const handleSelectedWidgets = dispatch => payload => (
  dispatch(setSelectedWidgets(payload))
);

const onErrorValidation = dispatch => () => {
  dispatch(processValidations());
};

const dispatchAction = dispatch => (type, payload) => {
  dispatch(onClearPopupDataAction());
  dispatch({
    type,
    payload,
  });
};

const clearPopupData = dispatch => () => {
  dispatch(onClearPopupDataAction());
};

const toggleIncvrfn = dispatch => (visibility) => {
  dispatch(toggleIncomeVerification(visibility));
};

const disableLockButton = dispatch => (payload) => {
  dispatch(enableLockButton(payload));
};

const onAdditionalInfoClick = dispatch => (loanNumber) => {
  dispatch(additionalInfo(loanNumber));
};

const onEvalRowSelect = dispatch => (evalId, index) => {
  dispatch(evalSelectRow({ evalId, index }));
};

const onUnassignBookingLoan = dispatch => () => {
  dispatch(unassignBookingLoan());
};


const onDismissUserNotification = dispatch => () => {
  dispatch(dismissUserNotification());
};

const setRequestTypeDataOperation = dispatch => (payload) => {
  dispatch(setRequestTypeDataAction(payload));
};

const checkTrialEnableStagerButtonOperation = dispatch => () => {
  dispatch(checkTrialDisableStagerButtonAction());
};

const getCancellationReasonDetails = dispatch => () => {
  dispatch(getCancellationReasons());
};

const setSelectedCancellationReasonData = dispatch => (payload) => {
  dispatch(setSelectedCancellationReason(payload));
};

const clearCancellationReasons = dispatch => () => {
  dispatch(clearCancellationDetails());
};

const setExceptionReviewIndicatorOperation = dispatch => (payload) => {
  dispatch(setExceptionReviewIndicatorAction(payload));
};

const setExceptionReviewCommentsOperation = dispatch => (payload) => {
  dispatch(setExceptionReviewCommentsAction(payload));
};

const getCaseIdsOperation = dispatch => () => {
  dispatch(getCaseIdsAction());
};

const setEnquiryCaseIdOperation = dispatch => (payload) => {
  dispatch(setEnquiryCaseIdAction(payload));
};

const setTrialDateInfo = dispatch => (payload) => {
  dispatch(setTrialDateInfoAction(payload));
};

const onUpdateTrialPeriod = dispatch => () => {
  dispatch(onUpdateTrialPeriodAction());
};

const odmRerunOperation = dispatch => () => {
  dispatch(odmRerunAction());
};

const disableSaveOperation = dispatch => (payload) => {
  dispatch(disableSaveAction(payload));
};

const dashboardResetDataOperation = dispatch => () => {
  dispatch(dashboardResetDataAction());
};

const operations = {
  openSweetAlert,
  onDismissUserNotification,
  onSubmitToFhlmcRequest,
  populateInvestorEvents,
  toggleIncvrfn,
  clearPopupData,
  dispatchAction,
  setCoviusIndex,
  openSweetAlertAction,
  closeSweetAlert,
  submitToCovius,
  clearEvalResponse,
  onAutoSave,
  onClearDisposition,
  onResetData,
  onExpand,
  onEndShift,
  onDispositionSave,
  onDispositionSelect,
  onGetNext,
  onSearchLoan,
  onSelectEval,
  onUnassignLoan,
  onUnassignSuccess,
  onAssignLoan,
  onAssignToMeClick,
  onDialogClose,
  onPostComment,
  onClearBEDisposition,
  onGetGroupName,
  validateDispositionTrigger,
  loadTrials,
  onSentToUnderwriting,
  onSendToDocGen,
  onSendToDocsIn,
  onSendToBooking,
  onCleanResult,
  onContinueMyReview,
  onCompleteMyReview,
  onEvalSubmit,
  onLoansSubmit,
  onFailedLoanValidation,
  onFailedEvalValidation,
  setBeginSearch,
  setPageType,
  onLoansSubmitStager,
  onClearUserNotifyMsg,
  onSelectReject,
  onUnassignBookingLoan,
  onClearSelectReject,
  onSearchLoanWithTask,
  setStagerTaskName,
  setStagerValueAndState,
  selectModReversal,
  onClearPostModEndShitf,
  onClearStagerTaskName,
  onClearBulkUploadDataAction,
  onTrialTask,
  onEvalInsertion,
  onCoviusCasesSubmit,
  onProcessFile,
  onDeleteFile,
  onSubmitFile,
  onClearSubmitCoviusData,
  downloadFile,
  populateEvents,
  onSendToFEUW,
  onWidgetClick,
  handleSelectedWidgets,
  onErrorValidation,
  onAdditionalInfoClick,
  onEvalRowSelect,
  setTombstoneDataForLoanView,
  onFhlmcCasesSubmit,
  onFHLMCModHistory,
  onTablePopupDataClear,
  onPopupClose,
  setRequestTypeDataOperation,
  checkTrialEnableStagerButtonOperation,
  onSentToBoardingTemplateOperation,
  getCancellationReasonDetails,
  setSelectedCancellationReasonData,
  clearCancellationReasons,
  setExceptionReviewIndicatorOperation,
  setExceptionReviewCommentsOperation,
  getCaseIdsOperation,
  setEnquiryCaseIdOperation,
  setTrialDateInfo,
  onUpdateTrialPeriod,
  odmRerunOperation,
  disableSaveOperation,
  disableLockButton,
  dashboardResetDataOperation,
};

export default operations;

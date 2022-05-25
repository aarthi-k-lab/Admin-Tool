import * as R from 'ramda';
import {
  SET_EXPAND_VIEW,
  SAVE_DISPOSITION,
  SAVE_SELECTED_DISPOSITION,
  CLEAR_DISPOSITION,
  CLEAR_FIRST_VISIT,
  HIDE_LOADER,
  SAVE_EVALID_LOANNUMBER,
  SUCCESS_END_SHIFT,
  SHOW_LOADER,
  SHOW_SAVING_LOADER,
  HIDE_SAVING_LOADER,
  CHECKLIST_NOT_FOUND,
  TASKS_NOT_FOUND,
  TASKS_FETCH_ERROR,
  AUTO_SAVE_TRIGGER,
  SEARCH_LOAN_RESULT,
  UNASSIGN_LOAN_RESULT,
  ASSIGN_LOAN_RESULT,
  HIDE_ASSIGN_UNASSIGN,
  CLEAR_BE_DISPOSITION,
  GROUP_NAME,
  SET_GET_NEXT_STATUS,
  USER_NOTIF_MSG,
  DISPLAY_ASSIGN,
  CLEAR_ERROR_MESSAGE,
  // GET_LOAN_ACTIVITY_DETAILS,
  LOAD_TRIALHEADER_RESULT,
  LOAD_TRIALSDETAIL_RESULT,
  LOAD_TRIALLETTER_RESULT,
  SET_TASK_UNDERWRITING_RESULT,
  GET_NEXT_ERROR,
  GETNEXT_PROCESSED,
  PUT_PROCESS_NAME,
  SET_RESULT_OPERATION,
  CLEAN_RESULT,
  CONTINUE_MY_REVIEW_RESULT,
  COMPLETE_MY_REVIEW_RESULT,
  SET_ADD_BULK_ORDER_RESULT,
  SET_BEGIN_SEARCH,
  SET_ENABLE_SEND_BACK_GEN,
  SET_BULK_UPLOAD_RESULT,
  SET_BULK_UPLOAD_PAGE_TYPE,
  SET_ENABLE_SEND_BACK_DOCSIN,
  SET_ENABLE_SEND_TO_BOOKING,
  CLEAR_USER_NOTIF_MSG,
  SET_ENABLE_SEND_TO_UW, SELECT_REJECT,
  CLEAR_SELECT_REJECT,
  SEARCH_LOAN_WITH_TASK,
  SET_STAGER_TASK_NAME,
  SET_STAGER_VALUE_STATE,
  MOD_REVERSAL_DROPDOWN_VALUES,
  POSTMOD_END_SHIFT,
  CLEAR_POSTMOD_END_SHIFT,
  CLEAR_BULKUPLOAD_TABLEDATA,
  CLEAR_DATA,
  SET_INCENTIVE_TASKCODES,
  STORE_EVALID_RESPONSE,
  RESOLUTION_DROP_DOWN_VALUES,
  SET_TRIAL_RESPONSE,
  DISABLE_TRIAL_BUTTON,
  DISCARD_EVAL_RESPONSE,
  SAVE_PROCESSED_FILE,
  DELETE_FILE,
  SET_COVIUS_DATA,
  CLEAR_COVIUS_SUBMIT_DATA,
  SET_DOWNLOAD_RESPONSE,
  SAVE_EVENTS_DROPDOWN,
  SAVE_INVESTOR_EVENTS_DROPDOWN,
  CLOSE_SWEET_ALERT,
  SET_COVIUS_TABINDEX,
  DISABLE_SEND_TO_FEUW,
  SAVE_EVAL_FOR_WIDGET,
  SAVE_MAIN_CHECKLIST,
  SET_USER_NOTIF_MESSAGE,
  SAVE_TASKID,
  DISABLE_PUSHDATA,
  ASSIGN_TO_ME_CLICK,
  SET_PAYMENT_DEFERRAL,
  SET_SELECTED_WIDGET,
  TOGGLE_LOCK_BUTTON,
  SET_POPUP_DATA,
  CLEAR_POPUP_DATA,
  TOGGLE_INCVRFN,
  EVAL_CASE_DETAILS,
  SET_CASE_DETAILS,
  SET_EVAL_INDEX,
  SAVE_EVAL_LOANVIEW,
  SET_USER_NOTIFICATION,
  DISMISS_USER_NOTIFICATION,
  SET_FHLMC_UPLOAD_RESULT,
  SET_FHLMC_MOD_HISTORY,
  TOGGLE_BANNER,
  SET_RESOLUTION_AND_INVSTR_HRCHY,
  GET_ELIGIBLE_DATA,
  SET_REQUEST_TYPE_DATA,
  SET_VALID_EVALDATA,
  CLEAR_POPUP_TABLE_DATA,
  SET_TRIAL_DISABLE_STAGER_BUTTON,
  SET_CANCELLATION_REASON,
  SET_SELECTED_CANCELLATION_REASON,
  CLEAR_CANCELLATION_REASONS,
} from './types';

const reducer = (state = {
  firstVisit: true,
  coviusTabIndex: 0,
}, action) => {
  switch (action.type) {
    case TOGGLE_INCVRFN: {
      return {
        ...state,
        isIncomeVerification: action.payload,
      };
    }
    case SET_PAYMENT_DEFERRAL: {
      const data = action.payload;
      return {
        ...state,
        isPaymentDeferral: data,
      };
    }
    case DISCARD_EVAL_RESPONSE: {
      return {
        ...state,
        evalInsertionStatus: null,
      };
    }
    case STORE_EVALID_RESPONSE: {
      return {
        ...state,
        evalInsertionStatus: action.payload,
      };
    }
    case SET_INCENTIVE_TASKCODES: {
      return {
        ...state,
        incentiveTaskCodes: action.payload,
      };
    }
    case SET_GET_NEXT_STATUS: {
      return {
        ...state,
        showGetNext: action.payload,
      };
    }
    case USER_NOTIF_MSG: {
      return {
        ...state,
        checklistDiscrepancies: action.payload,
      };
    }
    case CLEAR_USER_NOTIF_MSG: {
      return {
        ...state,
        checklistDiscrepancies: {},
      };
    }
    case SELECT_REJECT: {
      return {
        ...state,
        rejectResponse: action.payload,
        wasSearched: false,
      };
    }
    case CLEAR_SELECT_REJECT: {
      const trialClosingResponse = null;
      return {
        ...state,
        trialClosingResponse,
        rejectResponse: null,
      };
    }
    // case GET_LOAN_ACTIVITY_DETAILS: {
    //   return {
    //     ...state,
    //     loanActivityDetails: action.payload,
    //   };
    // }
    case CLEAR_DISPOSITION: {
      const newState = {
        ...state,
        selectedDisposition: '',
      };
      delete newState.getNextResponse;
      return newState;
    }
    case SEARCH_LOAN_WITH_TASK: {
      return {
        ...state,
        searchLoanTaskResponse: action.payload,
        assignLoanResponse: {},
        unassignLoanResponse: {},
        clearSearch: true,
        checklistErrorCode: '',
      };
    }
    case SET_STAGER_TASK_NAME: {
      return {
        ...state,
        stagerTaskName: action.payload,
      };
    }
    case SET_STAGER_VALUE_STATE: {
      return {
        ...state,
        stagerValueAndState: action.payload,
      };
    }
    case CLEAR_FIRST_VISIT: {
      const newState = {
        ...state,
        firstVisit: false,
        isAssigned: false,
      };
      return newState;
    }
    case SET_EXPAND_VIEW: {
      return {
        ...state,
        expandView: !state.expandView,
      };
    }
    case SAVE_DISPOSITION: {
      let getNextResponse = {};
      if (action.payload) {
        getNextResponse = action.payload;
      }
      return {
        ...state,
        getNextResponse,
      };
    }

    case DISMISS_USER_NOTIFICATION: {
      return {
        ...state,
        userNotification: {
          isOpen: false,
          level: null,
          message: null,
        },
      };
    }
    case POSTMOD_END_SHIFT: {
      return {
        postModEndShift: true,
        firstVisit: true,
        isAssigned: true,
        clearSearch: true,
        groupName: state.groupName,
        stagerTaskName: state.stagerTaskName,
        getSearchLoanResponse: {},
      };
    }
    case CLEAR_POSTMOD_END_SHIFT: {
      return {
        ...state,
        postModEndShift: false,
      };
    }
    case SEARCH_LOAN_RESULT: {
      let getSearchLoanResponse = {};
      let loannumber = null;
      if (action.payload) {
        getSearchLoanResponse = action.payload;

        const { loanNumber } = getSearchLoanResponse;
        loannumber = loanNumber;
      }
      return {
        ...state,
        getSearchLoanResponse,
        loanNumber: loannumber,
        assignLoanResponse: {},
        unassignLoanResponse: {},
        clearSearch: true,
        checklistErrorCode: '',
        inProgress: false,
        wasSearched: true,
        userNotification: {},
        isIncomeVerification: false,
      };
    }

    case UNASSIGN_LOAN_RESULT: {
      let unassignLoanResponse = {};
      if (action.payload) {
        unassignLoanResponse = action.payload;
      }
      return {
        ...state,
        unassignLoanResponse,
      };
    }
    case ASSIGN_LOAN_RESULT: {
      let assignLoanResponse = {};
      const { showAssign } = state;
      if (action.payload) {
        assignLoanResponse = action.payload;
      }
      return {
        ...state,
        assignLoanResponse,
        isAssigned: R.isNil(showAssign) && !R.isEmpty(assignLoanResponse),
      };
    }
    case SHOW_LOADER: {
      return {
        ...state,
        inProgress: true,
        noTasksFound: false,
        checklistErrorCode: '',
        wasSearched: false,
      };
    }
    case GETNEXT_PROCESSED: {
      return {
        ...state,
        getNextProcessed: action.payload,
      };
    }
    case HIDE_LOADER: {
      return {
        ...state,
        inProgress: false,
      };
    }
    case SET_BEGIN_SEARCH: {
      return {
        ...state,
        wasSearched: false,
        resultOperation: {},
      };
    }
    case SHOW_SAVING_LOADER: {
      return {
        ...state,
        saveInProgress: true,
      };
    }
    case HIDE_SAVING_LOADER: {
      return {
        ...state,
        saveInProgress: false,
      };
    }
    case SUCCESS_END_SHIFT: {
      return {
        firstVisit: true,
        isAssigned: true,
        clearSearch: true,
        groupName: state.groupName,
        stagerTaskName: state.stagerTaskName,
        getSearchLoanResponse: {},
      };
    }
    case CHECKLIST_NOT_FOUND: {
      return {
        ...state,
        noTasksFound: true,
        checklistErrorCode: R.pathOr('', ['payload', 'messageCode'], action),
      };
    }
    case TASKS_NOT_FOUND: {
      let noTasksFound;
      if (action.payload) {
        ({ noTasksFound } = action.payload);
      }
      return {
        ...state,
        noTasksFound,
        evalId: null,
        loanNumber: null,
        taskId: null,
      };
    }
    case GET_NEXT_ERROR: {
      let isGetNextError;
      let getNextError;
      if (action.payload) {
        ({ isGetNextError, getNextError } = action.payload);
      }
      return {
        ...state,
        isGetNextError,
        getNextError,
        evalId: null,
        loanNumber: null,
        taskId: null,
      };
    }
    case TASKS_FETCH_ERROR: {
      let taskFetchError;
      if (action.payload) {
        taskFetchError = action.payload.taskfetchError;
      }
      return {
        ...state,
        taskFetchError,
        evalId: null,
        loanNumber: null,
        taskId: null,
      };
    }
    case AUTO_SAVE_TRIGGER: {
      let taskStatusUpdate;
      if (action.payload) {
        taskStatusUpdate = action.payload;
      }
      return {
        ...state,
        taskStatusUpdate,
      };
    }
    case SAVE_SELECTED_DISPOSITION: {
      let selectedDisposition = '';
      if (action.payload) {
        selectedDisposition = action.payload;
      }
      return {
        ...state,
        selectedDisposition,
      };
    }
    case SAVE_EVALID_LOANNUMBER: {
      const newState = {
        ...state,
        brand: action.payload.brand,
        evalId: action.payload.evalId,
        selectedResolutionId: action.payload.resolutionId,
        loanNumber: action.payload.loanNumber,
        taskId: action.payload.taskId,
        processId: action.payload.piid,
        processStatus: action.payload.pstatus,
        taskStatus: action.payload.tstatus,
        processName: action.payload.taskName,
        showAssign: action.payload.isSearch ? !!action.payload.assignee : null,
        taskFetchError: false,
        noTasksFound: false,
        isAssigned: action.payload.isSearch ? action.payload.isAssigned : true,
        taskIterationCounter: action.payload.taskIterationCounter,
        showContinueMyReview: action.payload.isSearch ? action.payload.showContinueMyReview : false,
        getSearchLoanResponse: {},
        completeReviewResponse: null,
      };
      return newState;
    }
    case SAVE_EVAL_FOR_WIDGET: {
      const widgetLoan = action.payload;
      return {
        ...state,
        widgetLoan,
      };
    }
    case SAVE_MAIN_CHECKLIST: {
      const checklistDetails = action.payload;
      return {
        ...state,
        ...checklistDetails,
      };
    }
    case CONTINUE_MY_REVIEW_RESULT: {
      const newState = {
        ...state,
        isAssigned: action.payload,
        showContinueMyReview: !action.payload,
        showAssign: null,
      };
      return newState;
    }

    case COMPLETE_MY_REVIEW_RESULT: {
      return {
        ...state,
        completeReviewResponse: action.payload,
        firstVisit: true,
        isAssigned: true,
        clearSearch: true,
        groupName: state.groupName,
        stagerTaskName: state.stagerTaskName,
        getSearchLoanResponse: {},
      };
    }

    case HIDE_ASSIGN_UNASSIGN: {
      const { assignLoanResponse } = state;
      return {
        ...state,
        showAssign: null,
        showCompleteMyreview: false,
        isAssigned: !R.isEmpty(assignLoanResponse),
      };
    }

    case DISPLAY_ASSIGN: {
      const { assignLoanResponse } = state;
      return {
        ...state,
        showAssign: false,
        isAssigned: !R.isEmpty(assignLoanResponse),
        showContinueMyReview: false,
      };
    }

    case GROUP_NAME: {
      return {
        ...state,
        groupName: action.payload,
      };
    }
    case CLEAR_BE_DISPOSITION: {
      const { selectedDisposition } = state;
      const clearDisposition = {
        ...selectedDisposition,
        id: '',
        statusName: '',
        isActivitySelected: '',
        cardStatus: {},
      };
      const newState = {
        ...state,
        selectedDisposition: clearDisposition,
      };
      return newState;
    }

    case CLEAR_ERROR_MESSAGE: {
      return {
        ...state,
        noTasksFound: false,
        checklistErrorCode: '',
      };
    }
    case LOAD_TRIALHEADER_RESULT: {
      const trialHeader = action.payload;
      const enableSendToUW = true;
      const disableTrialTaskButton = false;
      return {
        ...state,
        trialHeader,
        enableSendToUW,
        disableTrialTaskButton,
        loading: false,
      };
    }

    case PUT_PROCESS_NAME: {
      const processName = action.payload;
      return {
        ...state,
        processName,
        loading: false,
      };
    }
    case LOAD_TRIALSDETAIL_RESULT: {
      const trialsDetail = action.payload;
      return {
        ...state,
        trialsDetail,
        loading: false,
      };
    }

    case LOAD_TRIALLETTER_RESULT: {
      const trialsLetter = action.payload;
      return {
        ...state,
        trialsLetter,
        loading: false,
      };
    }

    case SET_TASK_UNDERWRITING_RESULT: {
      const resultUnderwriting = action.payload;
      return {
        ...state,
        resultUnderwriting,
        loading: false,
      };
    }
    case SET_USER_NOTIF_MESSAGE: {
      const { clearData } = action.payload;
      const userNotification = {
        ...action.payload,
        isOpen: true,
        clearData: clearData || false,
      };
      return {
        ...state,
        userNotification,
        tableData: [],
        loading: false,
      };
    }
    case SET_RESULT_OPERATION: {
      const { clearData } = action.payload;
      const resultOperation = {
        ...action.payload,
        isOpen: true,
        clearData: clearData || false,
      };
      return {
        ...state,
        resultOperation,
        tableData: [],
        loading: false,
      };
    }
    case SET_USER_NOTIFICATION: {
      const { message, level } = action.payload;
      const userNotification = {
        message,
        level,
        isOpen: true,
      };
      return {
        ...state,
        userNotification,
      };
    }

    case SET_POPUP_DATA: {
      const popupData = {
        ...action.payload,
        isOpen: true,
      };
      return {
        ...state,
        popupData,
      };
    }

    case CLEAR_POPUP_DATA: {
      return {
        ...state,
        popupData: {},
      };
    }

    case CLEAR_BULKUPLOAD_TABLEDATA: {
      return {
        ...state,
        tableData: [],
      };
    }

    case CLEAR_DATA: {
      const resultOperation = {};
      const resultData = {};
      const eventNames = [];
      const sendToCoviusSuccess = undefined;
      return {
        ...state,
        resultData,
        resultOperation,
        eventNames,
        sendToCoviusSuccess,
        coviusTabIndex: 0,
      };
    }

    case CLEAN_RESULT: {
      const resultOperation = {};
      const enableSendToDocGen = true;
      const enableSendToDocsIn = true;
      const enableSendToBooking = true;
      return {
        ...state,
        resultOperation,
        enableSendToDocGen,
        enableSendToDocsIn,
        enableSendToBooking,
        loading: false,
        incCalcLockVisibility: true,
      };
    }

    case SET_ADD_BULK_ORDER_RESULT: {
      const tableData = action.payload;
      return {
        ...state,
        tableData,
        loading: false,
      };
    }

    case SET_BULK_UPLOAD_RESULT: {
      let resultData = {};
      resultData = action.payload;
      const resultOperation = {};
      return {
        ...state,
        resultData,
        resultOperation,
        loading: false,
      };
    }

    case SET_FHLMC_UPLOAD_RESULT: {
      const resultData = action.payload;
      return {
        ...state,
        resultData,
        loading: false,
      };
    }

    case SET_FHLMC_MOD_HISTORY: {
      const popupTableData = action.payload;
      return {
        ...state,
        popupTableData,
      };
    }

    case CLEAR_POPUP_TABLE_DATA: {
      return {
        ...state,
        popupTableData: null,
      };
    }

    case SET_ENABLE_SEND_BACK_GEN: {
      const enableSendToDocGen = action.payload;
      return {
        ...state,
        enableSendToDocGen,
      };
    }

    case SET_BULK_UPLOAD_PAGE_TYPE: {
      const pageType = action.payload;
      return {
        ...state,
        pageType,
      };
    }

    case SET_ENABLE_SEND_BACK_DOCSIN: {
      const enableSendToDocsIn = action.payload;
      return {
        ...state,
        enableSendToDocsIn,
        disableAssigntomeBtn: true,
      };
    }

    case SET_ENABLE_SEND_TO_BOOKING: {
      const enableSendToBooking = action.payload;
      return {
        ...state,
        enableSendToBooking,
        disableAssigntomeBtn: true,
      };
    }

    case ASSIGN_TO_ME_CLICK: {
      const disableAssigntomeBtn = action.payload;
      return {
        ...state,
        disableAssigntomeBtn,
      };
    }

    case DISABLE_SEND_TO_FEUW: {
      return {
        ...state,
        disableSendToFEUW: true,
      };
    }

    case SET_ENABLE_SEND_TO_UW: {
      const enableSendToUW = action.payload;
      return {
        ...state,
        enableSendToUW,
      };
    }

    case MOD_REVERSAL_DROPDOWN_VALUES: {
      const modReversalReasons = action.payload;
      return {
        ...state,
        modReversalReasons,
      };
    }

    case RESOLUTION_DROP_DOWN_VALUES: {
      const resolutionData = action.payload;
      return {
        ...state,
        resolutionData,
      };
    }

    case SET_TRIAL_RESPONSE: {
      const trialClosingResponse = action.payload;
      return {
        ...state,
        trialClosingResponse,
      };
    }

    case DISABLE_TRIAL_BUTTON: {
      return {
        ...state,
        disableTrialTaskButton: action.payload.disableTrialTaskButton,
        enableSendToUW: !action.payload.disableTrialTaskButton,
      };
    }

    case SAVE_PROCESSED_FILE:
      return {
        ...state,
        excelParsedData: action.payload,
      };

    case DELETE_FILE:
      return {
        ...state,
        isFileDeleted: action.payload,
        fileSubmitResponse: {},
        excelParsedData: null,
      };
    case SET_COVIUS_DATA: {
      const { resultData } = state;
      const { uploadFailed } = action.payload;
      return {
        ...state,
        resultData: R.isEmpty(uploadFailed) ? {} : { ...resultData, uploadFailed },
        fileSubmitResponse: action.payload,
      };
    }
    case SET_COVIUS_TABINDEX: {
      const { coviusTabIndex } = action.payload;
      return {
        ...state,
        coviusTabIndex: coviusTabIndex || 0,
      };
    }
    case DISABLE_PUSHDATA: {
      return {
        ...state,
        disablePushData: action.payload,
      };
    }
    case CLOSE_SWEET_ALERT: {
      return {
        ...state,
        resultOperation: {},
      };
    }
    case CLEAR_COVIUS_SUBMIT_DATA:
      return {
        ...state,
        fileSubmitResponse: {},
        downloadResponse: {},
      };
    case SET_DOWNLOAD_RESPONSE:
      return {
        ...state,
        downloadResponse: action.payload,
      };
    case SAVE_EVENTS_DROPDOWN: {
      const { payload } = action;
      return {
        ...state,
        coviusEventOptions: payload,
      };
    }
    case SAVE_INVESTOR_EVENTS_DROPDOWN: {
      const { payload } = action;
      return {
        ...state,
        investorEventOptions: payload,
      };
    }
    case SET_SELECTED_WIDGET: {
      return {
        ...state,
        selectedWidget: action.payload,
      };
    }
    case SAVE_TASKID: {
      const bookingTaskId = action.payload;
      return {
        ...state,
        bookingTaskId,
      };
    }
    case TOGGLE_LOCK_BUTTON: {
      const enableLockButton = action.payload;
      return {
        ...state,
        enableLockButton,
      };
    }

    case TOGGLE_BANNER: {
      const showBanner = action.payload;
      return {
        ...state,
        showBanner,
      };
    }

    case EVAL_CASE_DETAILS: {
      const evalCaseDetails = action.payload;
      return {
        ...state,
        evalCaseDetails,
      };
    }

    case SET_CASE_DETAILS: {
      const caseDetails = action.payload;
      return {
        ...state,
        caseDetails,
      };
    }

    case SET_EVAL_INDEX: {
      const { index, evalId } = action.payload;

      return {
        ...state,
        evalIndex: index,
        addInfoEvalId: evalId,
      };
    }

    case SAVE_EVAL_LOANVIEW: {
      const newState = {
        ...state,
        brand: action.payload.brand,
        evalId: action.payload.evalId,
        loanNumber: action.payload.loanNumber,
        taskId: action.payload.taskId,
        processId: action.payload.piid,
        processStatus: action.payload.pstatus,
        taskStatus: action.payload.tstatus,
        processName: action.payload.taskName,
        showAssign: action.payload.isSearch ? !!action.payload.assignee : null,
        taskFetchError: false,
        noTasksFound: false,
        isAssigned: action.payload.isSearch ? action.payload.isAssigned : true,
        taskIterationCounter: action.payload.taskIterationCounter,
        showContinueMyReview: action.payload.isSearch ? action.payload.showContinueMyReview : false,
        completeReviewResponse: null,
      };
      return newState;
    }

    case SET_RESOLUTION_AND_INVSTR_HRCHY: {
      const { resolutionId, investorHierarchy } = action.payload;
      return {
        ...state,
        resolutionId,
        investorHierarchy,
      };
    }

    case SET_REQUEST_TYPE_DATA: {
      const setRequestTypeData = action.payload;
      return {
        ...state,
        setRequestTypeData,
      };
    }

    case GET_ELIGIBLE_DATA: {
      return {
        ...state,
        eligibleData: action.payload,
      };
    }

    case SET_VALID_EVALDATA: {
      const evalStatusData = action.payload;
      const resultOperation = {};
      return {
        ...state,
        evalStatusData,
        resultOperation,
      };
    }

    case SET_TRIAL_DISABLE_STAGER_BUTTON: {
      const disableTrialStagerButton = action.payload;
      return {
        ...state,
        disableTrialStagerButton,
      };
    }


    case SET_CANCELLATION_REASON: {
      const cancellationReasons = action.payload;
      return {
        ...state,
        selectedCancellationReason: '',
        cancellationReasons,
      };
    }

    case SET_SELECTED_CANCELLATION_REASON: {
      const selectedCancellationReason = action.payload;
      return {
        ...state,
        selectedCancellationReason,
      };
    }

    case CLEAR_CANCELLATION_REASONS: {
      return {
        ...state,
        selectedCancellationReason: '',
        cancellationReasons: [],
      };
    }

    default:
      return state;
  }
};

export default reducer;

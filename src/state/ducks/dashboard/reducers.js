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
  TASKS_LIMIT_EXCEEDED,
  GETNEXT_PROCESSED,
  PUT_PROCESS_NAME,
  SET_RESULT_OPERATION,
  CLEAN_RESULT,
  CONTINUE_MY_REVIEW_RESULT,
  SET_ADD_BULK_ORDER_RESULT,
  SET_BEGIN_SEARCH,
  SET_ENABLE_SEND_BACK_GEN,
  SET_BULK_UPLOAD_PAGE_TYPE,
  SET_ENABLE_SEND_BACK_DOCSIN,
  CLEAR_USER_NOTIF_MSG,
  SET_ENABLE_SEND_TO_UW, SELECT_REJECT,
  CLEAR_SELECT_REJECT,
  SEARCH_LOAN_WITH_TASK,
  SET_STAGER_TASK_NAME,
} from './types';

const reducer = (state = { firstVisit: true }, action) => {
  switch (action.type) {
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
      return {
        ...state,
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
        inProgress: false,
      };
    }
    case SET_STAGER_TASK_NAME: {
      return {
        ...state,
        stagerTaskName: action.payload,
      };
    }
    case CLEAR_FIRST_VISIT: {
      const newState = {
        ...state,
        firstVisit: false,
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
    case SEARCH_LOAN_RESULT: {
      let getSearchLoanResponse = {};
      if (action.payload) {
        getSearchLoanResponse = action.payload;
      }
      return {
        ...state,
        getSearchLoanResponse,
        assignLoanResponse: {},
        unassignLoanResponse: {},
        clearSearch: true,
        checklistErrorCode: '',
        inProgress: false,
        wasSearched: true,
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
    case TASKS_LIMIT_EXCEEDED: {
      let isTasksLimitExceeded;
      if (action.payload) {
        ({ isTasksLimitExceeded } = action.payload);
      }
      return {
        ...state,
        isTasksLimitExceeded,
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
      };
      return newState;
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

    case HIDE_ASSIGN_UNASSIGN: {
      const { assignLoanResponse } = state;
      return {
        ...state,
        showAssign: null,
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
      return {
        ...state,
        trialHeader,
        enableSendToUW,
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

    case SET_RESULT_OPERATION: {
      const resultOperation = action.payload;
      return {
        ...state,
        resultOperation,
        tableData: [],
        loading: false,
      };
    }

    case CLEAN_RESULT: {
      const resultOperation = {};
      const enableSendToDocGen = true;
      const enableSendToDocsIn = true;
      return {
        ...state,
        resultOperation,
        enableSendToDocGen,
        enableSendToDocsIn,
        loading: false,
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
      };
    }

    case SET_ENABLE_SEND_TO_UW: {
      const enableSendToUW = action.payload;
      return {
        ...state,
        enableSendToUW,
      };
    }

    default:
      return state;
  }
};

export default reducer;

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
    case CLEAR_DISPOSITION: {
      const newState = {
        ...state,
        selectedDisposition: '',
      };
      delete newState.getNextResponse;
      return newState;
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
      };
    }
    case HIDE_LOADER: {
      return {
        ...state,
        inProgress: false,
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
        showAssign: action.payload.isSearch ? !!action.payload.assignee : null,
        taskFetchError: false,
        noTasksFound: false,
        isAssigned: !action.payload.isSearch,
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
    default:
      return state;
  }
};

export default reducer;

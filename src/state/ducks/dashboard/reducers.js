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
  TASKS_NOT_FOUND,
  TASKS_FETCH_ERROR,
  AUTO_SAVE_TRIGGER,
} from './types';

const reducer = (state = { firstVisit: true }, action) => {
  switch (action.type) {
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
    case SHOW_LOADER: {
      return {
        ...state,
        inProgress: true,
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
      };
    }
    case TASKS_NOT_FOUND: {
      let noTasksFound;
      if (action.payload) {
        noTasksFound = action.payload.notasksFound;
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
        taskFetchError: false,
        notasksFound: false,
      };
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;

import {
  SET_EXPAND_VIEW,
  SAVE_DISPOSITION,
  SAVE_SELECTED_DISPOSITION,
  CLEAR_DISPOSITION,
  CLEAR_FIRST_VISIT,
  SAVE_EVALID_LOANNUMBER,
  SUCCESS_END_SHIFT,
  TASKS_NOT_FOUND,
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
    case SUCCESS_END_SHIFT: {
      return {
        ...state,
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
      };
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;

import {
  ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS,
  LOADING_CHECKLIST,
  LOADING_TASKS,
  STORE_CHECKLIST,
  STORE_TASKS,
} from './types';

const FAILED = 'failed';
const LOADING = 'loading';
const SUCCEEDED = 'succeeded';

const defaultState = {
  checklistLoadingStatus: SUCCEEDED,
  taskLoadingStatus: SUCCEEDED,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case ERROR_LOADING_CHECKLIST:
      return {
        ...state,
        checklistLoadingStatus: FAILED,
      };
    case ERROR_LOADING_TASKS:
      return {
        ...state,
        taskLoadingStatus: FAILED,
      };
    case LOADING_CHECKLIST:
      return {
        ...state,
        checklistLoadingStatus: LOADING,
      };
    case LOADING_TASKS:
      return {
        ...state,
        taskLoadingStatus: LOADING,
      };
    case STORE_CHECKLIST: {
      return {
        ...state,
        checklist: action.payload,
        checklistLoadingStatus: SUCCEEDED,
      };
    }
    case STORE_TASKS: {
      return {
        ...state,
        taskTree: action.payload,
        taskLoadingStatus: SUCCEEDED,
      };
    }
    default:
      return state;
  }
};

export default reducer;

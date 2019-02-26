import {
  STORE_CHECKLIST,
  STORE_TASKS,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_CHECKLIST: {
      return {
        ...state,
        checklist: action.payload,
      };
    }
    case STORE_TASKS: {
      return {
        ...state,
        taskTree: action.payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;

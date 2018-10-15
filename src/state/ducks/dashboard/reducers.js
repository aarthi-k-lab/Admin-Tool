import {
  SET_EXPAND_VIEW,
  SAVE_DISPOSITION,
  CLEAR_DISPOSITION,
  CLEAR_FIRST_VISIT,
} from './types';

const reducer = (state = { firstVisit: true }, action) => {
  switch (action.type) {
    case CLEAR_DISPOSITION: {
      const newState = {
        ...state,
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
    default:
      return state;
  }
};

export default reducer;

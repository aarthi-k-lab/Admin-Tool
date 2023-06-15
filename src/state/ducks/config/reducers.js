import {
  CONFIG_DATA_SUCCESS,
  CONFIG_DATA_FAILURE,
  CLEAR_REPORTS_DATA,
  TOGGLE_REPORTS,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case TOGGLE_REPORTS: {
      const loading = action.payload;
      return {
        ...state,
        loading,
      };
    }
    case CLEAR_REPORTS_DATA: {
      return {
        ...state,
        powerBIConstants: [],
      };
    }
    case CONFIG_DATA_SUCCESS:
    case CONFIG_DATA_FAILURE: {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;

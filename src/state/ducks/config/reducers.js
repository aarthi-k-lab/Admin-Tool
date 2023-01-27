import {
  CONFIG_DATA_SUCCESS,
  CONFIG_DATA_FAILURE,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
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

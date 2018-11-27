import { SET_STAGER_DATA_COUNTS, SET_STAGER_DATA } from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_STAGER_DATA_COUNTS: {
      const { counts } = action.payload ? action.payload : {};
      return {
        ...state,
        counts,
      };
    }

    case SET_STAGER_DATA: {
      const data = action.payload.data ? action.payload.data : action.payload.error;
      return {
        ...state,
        data,
        loading: false,
      };
    }

    default:
      return state;
  }
};

export default reducer;

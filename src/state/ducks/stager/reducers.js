import { SET_STAGER_DATA_COUNTS } from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_STAGER_DATA_COUNTS: {
      const { counts } = action.payload ? action.payload : {};
      return {
        ...state,
        counts,
      };
    }

    default:
      return state;
  }
};

export default reducer;

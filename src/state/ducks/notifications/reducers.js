import { SET_SNACK_BAR_VALUES, CLOSE_SNACK_BAR } from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SNACK_BAR_VALUES: {
      const snackBarData = action.payload;
      return {
        ...state,
        snackBarData,
      };
    }
    case CLOSE_SNACK_BAR: {
      return {
        ...state,
        snackBarData: [],
      };
    }
    default:
      return state;
  }
};

export default reducer;

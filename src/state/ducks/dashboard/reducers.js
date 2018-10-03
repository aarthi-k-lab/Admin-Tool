import { SET_EXPAND_VIEW } from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_EXPAND_VIEW: {
      return {
        ...state,
        expandView: !state.expandView,
      };
    }
    default:
      return state;
  }
};

export default reducer;

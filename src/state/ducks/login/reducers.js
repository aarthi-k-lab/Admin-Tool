import { SET_USER_SCHEMA_SUCCESS, SET_USER_SCHEMA_FAILED, SET_USER_ROLE } from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_USER_ROLE: {
      const user = {};
      if (action.payload) {
        user.role = action.payload;
      }
      return {
        ...state,
        ...user,
      };
    }
    case SET_USER_SCHEMA_SUCCESS:
    case SET_USER_SCHEMA_FAILED: {
      let user = {};
      if (action.payload) {
        user = action.payload;
      }
      return {
        ...state,
        ...user,
      };
    }
    default:
      return state;
  }
};

export default reducer;

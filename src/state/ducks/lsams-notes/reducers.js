/* eslint no-param-reassign: "error" */
import {
  FETCH_COMMENTS_CODE,
  SET_COMMENTS_CODE,
  CLEAR_COMMENTS_CODE,
} from './types';

const initialState = {
  commentsCode: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMMENTS_CODE: {
      return {
        ...state,
      };
    }

    case SET_COMMENTS_CODE: {
      return {
        ...state,
        commentsCode: action.payload,
      };
    }

    case CLEAR_COMMENTS_CODE: {
      return {
        ...state,
        commentsCode: [],
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;

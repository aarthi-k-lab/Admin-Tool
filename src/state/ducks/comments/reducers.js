import {
  GET_COMMENTS_RESULT,
  POST_COMMENT_RESULT,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case GET_COMMENTS_RESULT: {
      const comments = action.payload;
      return {
        ...state,
        comments,
        loading: false,
      };
    }

    case POST_COMMENT_RESULT: {
      const postResult = action.payload;
      return {
        ...state,
        postResult,
        loading: false,
      };
    }

    default:
      return state;
  }
};

export default reducer;

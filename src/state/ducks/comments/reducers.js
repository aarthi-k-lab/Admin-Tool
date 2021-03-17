import {
  GET_COMMENTS_RESULT,
  POST_COMMENT_RESULT,
  GET_EVALCOMMENTS_RESULT,
  GET_SEARCH_AREA,
  CLEAR_SEARCH,
} from './types';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case GET_COMMENTS_RESULT: {
      const { comments } = action.payload;
      return {
        ...state,
        comments,
        loading: false,
      };
    }
    case GET_EVALCOMMENTS_RESULT: {
      const evalComments = action.payload;
      return {
        ...state,
        evalComments,
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
    case GET_SEARCH_AREA: {
      const searchArea = action.payload;
      return {
        ...state,
        showEvalId: searchArea,
      };
    }


    case CLEAR_SEARCH: {
      return {
        ...state,
        showEvalId: false,
      };
    }

    default:
      return state;
  }
};

export default reducer;

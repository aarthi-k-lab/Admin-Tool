import {
  GET_COMMENTS_SAGA,
  GET_EVALCOMMENTS_SAGA,
  POST_COMMENT_SAGA,
  CLEAR_SEARCH,
} from './types';

const loadCommentsAction = payload => ({
  type: GET_COMMENTS_SAGA,
  payload,
});

const loadCommentsForEvalsAction = loanNumber => ({
  type: GET_EVALCOMMENTS_SAGA,
  payload: loanNumber,
});

const postCommentAction = comment => ({
  type: POST_COMMENT_SAGA,
  payload: comment,
});

const clearSearch = payload => ({
  type: CLEAR_SEARCH,
  payload,
});

export {
  loadCommentsAction,
  loadCommentsForEvalsAction,
  postCommentAction,
  clearSearch,
};

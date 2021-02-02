import {
  GET_COMMENTS_SAGA,
  GET_EVALCOMMENTS_SAGA,
  POST_COMMENT_SAGA,
} from './types';

const loadCommentsAction = payload => ({
  type: GET_COMMENTS_SAGA,
  payload,
});

const loadCommentsForEvalsAction = loanId => ({
  type: GET_EVALCOMMENTS_SAGA,
  payload: loanId,
});

const postCommentAction = comment => ({
  type: POST_COMMENT_SAGA,
  payload: comment,
});

export {
  loadCommentsAction,
  loadCommentsForEvalsAction,
  postCommentAction,
};

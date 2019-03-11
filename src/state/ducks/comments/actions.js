import {
  GET_COMMENTS_SAGA,
  POST_COMMENT_SAGA,
} from './types';

const loadCommentsAction = EvalId => ({
  type: GET_COMMENTS_SAGA,
  payload: EvalId,
});

const postCommentAction = comment => ({
  type: POST_COMMENT_SAGA,
  payload: comment,
});

export {
  loadCommentsAction,
  postCommentAction,
};

import { loadCommentsAction, postCommentAction } from './actions';

const getComments = dispatch => request => dispatch(
  loadCommentsAction(request),
);

const postComment = dispatch => comment => dispatch(
  postCommentAction(comment),
);

const operations = {
  getComments,
  postComment,
};

export default operations;

import { loadCommentsAction, postCommentAction, loadCommentsForEvalsAction } from './actions';

const getComments = dispatch => request => dispatch(
  loadCommentsAction(request),
);

const getCommentsForEvals = dispatch => loanNumber => dispatch(
  loadCommentsForEvalsAction(loanNumber),
);

const postComment = dispatch => comment => dispatch(
  postCommentAction(comment),
);

const operations = {
  getComments,
  postComment,
  getCommentsForEvals,
};

export default operations;

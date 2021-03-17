import {
  loadCommentsAction, postCommentAction,
  loadCommentsForEvalsAction, clearSearch,
} from './actions';

const getComments = dispatch => request => dispatch(
  loadCommentsAction(request),
);

const getCommentsForEvals = dispatch => loanNumber => dispatch(
  loadCommentsForEvalsAction(loanNumber),
);

const postComment = dispatch => comment => dispatch(
  postCommentAction(comment),
);

const clearOnSearch = dispatch => payload => dispatch(
  clearSearch(payload),
);

const operations = {
  getComments,
  postComment,
  getCommentsForEvals,
  clearOnSearch,
};

export default operations;

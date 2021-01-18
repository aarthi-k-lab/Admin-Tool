import * as R from 'ramda';

const getCommentsData = state => (state.comments.comments ? state.comments.comments : []);
const getEvalComments = state => R.pathOr([], ['comments', 'evalComments'], state);

const selectors = {
  getCommentsData,
  getEvalComments,
};

export default selectors;

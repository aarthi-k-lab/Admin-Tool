import * as R from 'ramda';

const getCommentsCode = state => R.pathOr([], ['lsamsNotes', 'commentsCode'], state);

const selectors = {
  getCommentsCode,
};

export default selectors;

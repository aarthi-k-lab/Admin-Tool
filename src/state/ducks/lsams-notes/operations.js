import {
  fetchCommentsCode,
  clearCommentsCode,
} from './actions';

const fetchCommentsCodeOperation = dispatch => () => dispatch(fetchCommentsCode());
const clearCommentsCodeOperation = dispatch => () => dispatch(clearCommentsCode());

const operations = {
  fetchCommentsCodeOperation,
  clearCommentsCodeOperation,
};

export default operations;

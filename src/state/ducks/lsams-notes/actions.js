import {
  FETCH_COMMENTS_CODE,
  CLEAR_COMMENTS_CODE,
} from './types';

const fetchCommentsCode = payload => ({
  type: FETCH_COMMENTS_CODE,
  payload,
});

const clearCommentsCode = payload => ({
  type: CLEAR_COMMENTS_CODE,
  payload,
});


export {
  fetchCommentsCode,
  clearCommentsCode,
};

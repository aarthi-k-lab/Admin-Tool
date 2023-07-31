/* eslint-disable import/prefer-default-export */
import {
  select,
  takeEvery,
  all,
  put,
  call,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import * as R from 'ramda';
import {
  FETCH_COMMENTS_CODE,
  SET_COMMENTS_CODE,
} from './types';
import { selectors as dashboardSelectors } from '../dashboard';

const fetchCommentsCode = function* fetchCommentsCode() {
  try {
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const brand = yield select(dashboardSelectors.brand);

    const response = yield call(Api.callGet, `/api/utility/GetLsamsCommentCode?loanId=${loanNumber}&brand=${brand}`);

    if (response) {
      const commentsCodeList = R.pathOr([], ['getCommentCodesResult', 'commentCodesResultSet', 'commentCodes'], response);

      yield put({ type: SET_COMMENTS_CODE, payload: commentsCodeList });
    }
  } catch (e) {
    yield put({ type: SET_COMMENTS_CODE, payload: [] });
  }
};
function* watchFetchCommentsCode() {
  yield takeEvery(FETCH_COMMENTS_CODE, fetchCommentsCode);
}

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchFetchCommentsCode(),
  ]);
};

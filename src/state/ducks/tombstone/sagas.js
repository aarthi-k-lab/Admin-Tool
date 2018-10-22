import {
  select,
  takeEvery,
  all,
  // call,
  // fork,
  put,
} from 'redux-saga/effects';
// import * as R from 'ramda';
// import * as Api from 'lib/Api';
// import { actions as tombstoneActions } from 'ducks/tombstone';
// import LoanTombstone from 'models/LoanTombstone';
import {
  LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  FETCH_TOMBSTONE_DATA,
} from './types';
import { selectors as dashboardSelectors } from '../dashboard';

function* fetchTombstoneData() {
  yield put({ type: LOADING_TOMBSTONE_DATA });
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const evalId = yield select(dashboardSelectors.evalId);
  try {
    // const data = yield call(LoanTombstone.fetchData, loanNumber);
    const data = [{
      title: 'Loan Number',
      content: loanNumber,
    }, {
      title: 'Eval ID',
      content: evalId,
    }];
    yield put({ type: SUCCESS_LOADING_TOMBSTONE_DATA, payload: data });
  } catch (e) {
    console.error(e);
    // yield put({ type: SUCCESS_LOADING_TOMBSTONE_DATA, payload: { loanNumber, evalId } });
    yield put({ type: ERROR_LOADING_TOMBSTONE_DATA });
  }
}

function* watchTombstone() {
  yield takeEvery(FETCH_TOMBSTONE_DATA, fetchTombstoneData);
}

export const TestExports = {
  fetchTombstoneData,
  watchTombstone,
};

// eslint-disable-next-line
export const combinedSaga = function* combinedSaga() {
  yield all([
    watchTombstone(),
  ]);
};

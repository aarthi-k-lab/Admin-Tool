import {
  select,
  takeEvery,
  all,
  call,
  // fork,
  put,
} from 'redux-saga/effects';
import * as R from 'ramda';
// import * as Api from 'lib/Api';
// import { actions as tombstoneActions } from 'ducks/tombstone';
import LoanTombstone from 'models/LoanTombstone';
import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
  FETCH_TOMBSTONE_DATA,
} from './types';
import { selectors as dashboardSelectors } from '../dashboard';

function* fetchTombstoneData(payload) {
  const { taskName } = payload.payload;
  yield put({ type: LOADING_TOMBSTONE_DATA });

  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const evalId = yield select(dashboardSelectors.evalId);
  const groupName = yield select(dashboardSelectors.groupName);
  const postModTaskName = yield select(dashboardSelectors.stagerTaskName);

  // const evalId = '1928799';
  // const loanNumber = '596815091';

  try {
    const userGroup = R.equals(groupName, 'POSTMOD') ? postModTaskName.activeTile : groupName;
    const group = userGroup === 'Recordation' || userGroup === 'Countersign' ? taskName : userGroup;
    const data = yield call(LoanTombstone.fetchData, loanNumber, evalId, group, taskName);
    yield put({ type: SUCCESS_LOADING_TOMBSTONE_DATA, payload: data });
  } catch (e) {
    if (!R.isNil(loanNumber) && !R.isNil(evalId)) {
      const defaultData = [
        LoanTombstone.generateTombstoneItem('Loan #', loanNumber),
        LoanTombstone.generateTombstoneItem('EvalId', evalId),
      ];
      yield put({
        type: ERROR_LOADING_TOMBSTONE_DATA,
        payload: { data: defaultData, error: false, loading: false },
      });
    } else {
      yield put({
        type: ERROR_LOADING_TOMBSTONE_DATA,
        payload: { data: [], error: true, loading: false },
      });
    }
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

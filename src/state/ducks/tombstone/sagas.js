/* eslint-disable no-empty-function */
import {
  select,
  takeEvery,
  all,
  call,
  // fork,
  put,
} from 'redux-saga/effects';
import * as R from 'ramda';
import { setPaymentDeferral } from 'ducks/dashboard/actions';
import LoanTombstone from 'models/LoanTombstone';
import DashboardModel from 'models/Dashboard';
import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
  FETCH_TOMBSTONE_DATA,
} from './types';
import { selectors as dashboardSelectors } from '../dashboard';
import { SET_RESOLUTION_AND_INVSTR_HRCHY } from '../dashboard/types';

function* fetchTombstoneData(payload) {
  const { taskName, taskId } = payload.payload;
  yield put({ type: LOADING_TOMBSTONE_DATA });

  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const evalId = yield select(dashboardSelectors.evalId);
  const groupName = yield select(dashboardSelectors.groupName);
  const postModTaskName = yield select(dashboardSelectors.stagerTaskName);
  const brand = yield select(dashboardSelectors.brand);
  const tombstoneTaskId = R.equals(groupName, 'BOOKING') ? yield select(dashboardSelectors.getBookingTaskId) : taskId;
  try {
    const userGroup = R.equals(groupName, 'POSTMOD') || R.equals(groupName, 'UWSTAGER') ? postModTaskName.activeTile : groupName;
    const group = userGroup === 'Recordation' || userGroup === 'Countersign' || userGroup === 'Delay Checklist' ? taskName : userGroup;
    const data = yield call(LoanTombstone.fetchData,
      loanNumber, evalId, group, taskName, tombstoneTaskId, brand);
    const { resolutionId, investorHierarchy, tombstoneData } = data;
    // storing resolution id inside dashboard object
    yield put({
      type: SET_RESOLUTION_AND_INVSTR_HRCHY,
      payload: { resolutionId, investorHierarchy },
    });
    yield put(yield call(setPaymentDeferral, R.contains(DashboardModel.PDD, tombstoneData)));
    yield put({ type: SUCCESS_LOADING_TOMBSTONE_DATA, payload: tombstoneData });
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

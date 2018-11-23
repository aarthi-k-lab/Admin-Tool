import {
  take,
  all,
  call,
  put,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import {
  GET_DASHBOARD_COUNTS_SAGA,
  SET_STAGER_DATA_COUNTS,
} from './types';


function* fetchDashboardCounts() {
  try {
    const newPayload = yield call(Api.callGet, 'api/stager/dashboard/getCounts');
    if (newPayload != null) {
      yield put({
        type: SET_STAGER_DATA_COUNTS,
        payload: newPayload,
      });
    }
  } catch (e) {
    yield put({
      type: SET_STAGER_DATA_COUNTS,
      payload: {},
    });
  }
}

function* watchDashboardCountsFetch() {
  let payload = yield take(GET_DASHBOARD_COUNTS_SAGA);
  if (payload != null) {
    payload = yield fetchDashboardCounts();
  }
}

export const TestExports = {
  watchDashboardCountsFetch,
  fetchDashboardCounts,
};

export function* combinedSaga() {
  yield all([
    watchDashboardCountsFetch(),
  ]);
}

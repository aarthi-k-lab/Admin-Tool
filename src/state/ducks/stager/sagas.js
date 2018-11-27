import {
  take,
  takeEvery,
  all,
  call,
  put,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import {
  GET_DASHBOARD_COUNTS_SAGA,
  SET_STAGER_DATA_COUNTS,
  GET_DASHBOARD_DATA_SAGA,
  SET_STAGER_DATA,
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

function* fetchDashboardData(payload) {
  try {
    const searchTerm = payload.payload;
    const newPayload = yield call(Api.callGet, `api/stager/dashboard/getData/${searchTerm}`);
    if (newPayload != null) {
      yield put({
        type: SET_STAGER_DATA,
        payload: {
          error: false,
          data: newPayload,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_STAGER_DATA,
      payload: {
        error: true,
        message: 'Oops. There is some issue in fetching the data now. Try again later',
      },
    });
  }
}

function* watchDashboardCountsFetch() {
  const payload = yield take(GET_DASHBOARD_COUNTS_SAGA);
  if (payload != null) {
    yield fetchDashboardCounts();
  }
}

function* watchDashboardDataFetch() {
  yield takeEvery(GET_DASHBOARD_DATA_SAGA, fetchDashboardData);
}

export const TestExports = {
  watchDashboardCountsFetch,
  fetchDashboardCounts,
  watchDashboardDataFetch,
};

export function* combinedSaga() {
  yield all([
    watchDashboardCountsFetch(),
    watchDashboardDataFetch(),
  ]);
}

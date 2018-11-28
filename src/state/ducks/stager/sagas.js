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
  SET_STAGER_DATA_LOADING,
  TABLE_CHECKBOX_SELECT,
  TABLE_CHECKBOX_SELECT_TRIGGER,
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
    yield put({
      type: SET_STAGER_DATA_LOADING,
      payload: {
        error: false,
        loading: true,
      },
    });
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

function* onCheckboxSelect(data) {
  const selectedData = data.payload;
  yield put({
    type: TABLE_CHECKBOX_SELECT,
    payload: {
      error: false,
      selectedData,
    },
  });
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

function* watchTableCheckboxSelect() {
  yield takeEvery(TABLE_CHECKBOX_SELECT_TRIGGER, onCheckboxSelect);
}

export const TestExports = {
  watchDashboardCountsFetch,
  fetchDashboardCounts,
  watchDashboardDataFetch,
  watchTableCheckboxSelect,
};

export function* combinedSaga() {
  yield all([
    watchDashboardCountsFetch(),
    watchDashboardDataFetch(),
    watchTableCheckboxSelect(),
  ]);
}

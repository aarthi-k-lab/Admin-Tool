import {
  takeEvery,
  all,
  select,
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
  TRIGGER_ORDER_SAGA,
  SET_STAGER_ACTIVE_SEARCH_TERM,
} from './types';
import selectors from './selectors';
import { SET_SNACK_BAR_VALUES_SAGA } from '../notifications/types';

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
    yield put({
      type: SET_STAGER_ACTIVE_SEARCH_TERM,
      payload: searchTerm,
    });
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

function* fireSnackBar(snackBarData) {
  yield put({
    type: SET_SNACK_BAR_VALUES_SAGA,
    payload: snackBarData,
  });
}

function* makeOrderBpmCall(payload) {
  const response = yield call(Api.callPost, 'api/stager/stager/dashboard/order/valuation', payload.payload);
  const failedResponse = response.filter(data => data.error === true);
  yield call(fetchDashboardCounts);
  const activeSearchTerm = yield select(selectors.getActiveSearchTerm);
  yield call(fetchDashboardData, { payload: activeSearchTerm });
  yield call(onCheckboxSelect, { payload: [] });
  if (failedResponse && failedResponse.length > 0) {
    const snackBarData = {};
    snackBarData.message = 'Order call failed for Eval IDs: ';
    snackBarData.type = 'error';
    snackBarData.open = true;
    const failedEvalIds = failedResponse.map(failedData => failedData.data.evalId);
    snackBarData.message += failedEvalIds.toString();
    yield call(fireSnackBar, snackBarData);
  }
}

function* watchDashboardCountsFetch() {
  yield takeEvery(GET_DASHBOARD_COUNTS_SAGA, fetchDashboardCounts);
}

function* watchOrderCall() {
  yield takeEvery(TRIGGER_ORDER_SAGA, makeOrderBpmCall);
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
  watchOrderCall,
};

export function* combinedSaga() {
  yield all([
    watchDashboardCountsFetch(),
    watchDashboardDataFetch(),
    watchTableCheckboxSelect(),
    watchOrderCall(),
  ]);
}

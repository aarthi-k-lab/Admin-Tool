/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
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
  TRIGGER_DOCS_OUT_SAGA,
  SET_STAGER_ACTIVE_SEARCH_TERM,
  SET_STAGER_DOWNLOAD_CSV_URI,
  SET_DOCS_OUT_RESPONSE,
} from './types';
import selectors from './selectors';
import { SET_SNACK_BAR_VALUES_SAGA } from '../notifications/types';

function* fetchDashboardCounts(data) {
  try {
    const stagerType = data.payload;
    const response = yield call(Api.callGet, `api/stager/dashboard/getCounts/${stagerType}`);
    if (response != null) {
      yield put({
        type: SET_STAGER_DATA_COUNTS,
        payload: response,
      });
    }
  } catch (e) {
    yield put({
      type: SET_STAGER_DATA_COUNTS,
      payload: {},
    });
  }
}

function* fetchDashboardData(data) {
  let payload;
  try {
    const searchTerm = data.payload.activeSearchTerm;
    const stagerType = data.payload.stager;
    yield put({
      type: SET_STAGER_DATA_LOADING,
      payload: {
        error: false,
        loading: true,
      },
    });
    const response = yield call(Api.callGet, `api/stager/dashboard/getData/${stagerType}/${searchTerm}`);
    yield put({
      type: SET_STAGER_ACTIVE_SEARCH_TERM,
      payload: searchTerm,
    });
    const downloadCSVUri = `api/stager/dashboard/downloadData/${stagerType}/${searchTerm}`;
    yield put({
      type: SET_STAGER_DOWNLOAD_CSV_URI,
      payload: downloadCSVUri,
    });

    if (response != null) {
      payload = {
        error: false,
        data: response,
      };
    } else {
      payload = {
        error: false,
      };
    }
  } catch (e) {
    payload = {
      error: true,
      message: 'Oops. There is some issue in fetching the data now. Try again later',
    };
  } finally {
    yield put({
      type: SET_STAGER_DATA,
      payload,
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

function* setDocsOutData(data) {
  yield put({
    type: SET_DOCS_OUT_RESPONSE,
    payload: data,
  });
}

function* makeOrderBpmCall(payload) {
  try {
    const snackBar = {};
    snackBar.message = 'Ordering. Please wait... ';
    snackBar.type = 'message';
    snackBar.open = true;
    yield call(fireSnackBar, snackBar);
    const response = yield call(Api.callPost, 'api/stager/stager/dashboard/order/valuation', payload.payload);
    const failedResponse = response ? response.filter(data => data.error === true) : [];
    yield call(fetchDashboardCounts);
    const activeSearchTerm = yield select(selectors.getActiveSearchTerm);
    yield call(fetchDashboardData, { payload: activeSearchTerm });
    yield call(onCheckboxSelect, { payload: [] });
    if (failedResponse && failedResponse.length > 0) {
      const snackBarData = {};
      if (failedResponse.length > 5) {
        snackBarData.message = 'Order call failed for more than 5 Eval ID(s): Contact Admin!';
        snackBarData.type = 'error';
        snackBarData.open = true;
      } else {
        snackBarData.message = 'Order call failed for Eval ID(s): ';
        snackBarData.type = 'error';
        snackBarData.open = true;
        const failedEvalIds = failedResponse.map(failedData => failedData.data.evalId);
        snackBarData.message += failedEvalIds.toString();
      }
      yield call(fireSnackBar, snackBarData);
    } else {
      const snackBarData = {};
      snackBarData.message = 'Ordered Successfully!';
      snackBarData.type = 'success';
      snackBarData.open = true;
      yield call(fireSnackBar, snackBarData);
    }
  } catch (e) {
    const snackBarData = {};
    snackBarData.message = 'Something went wrong!!';
    snackBarData.type = 'error';
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
    console.log('Make Order BPM Call error:', e);
  }
}

function* watchDashboardCountsFetch() {
  yield takeEvery(GET_DASHBOARD_COUNTS_SAGA, fetchDashboardCounts);
}

function* watchOrderCall() {
  yield takeEvery(TRIGGER_ORDER_SAGA, makeOrderBpmCall);
}

function* makeDocsOutStagerCall(payload) {
  try {
    const docsOutAction = yield select(selectors.getdocsOutAction);
    const response = yield call(Api.callPost, `api/stager/stager/dashboard/docsout/${docsOutAction}`, payload.payload.data);
    yield call(fetchDashboardCounts, { payload: payload.type });
    const activeSearchTerm = yield select(selectors.getActiveSearchTerm);
    yield call(fetchDashboardData, {
      payload:
          { activeSearchTerm, stager: payload.payload.type },
    });
    yield call(onCheckboxSelect, { payload: [] });
    yield call(setDocsOutData, response);
  } catch (e) {
    const snackBarData = {};
    snackBarData.message = 'Something went wrong!!';
    snackBarData.type = 'error';
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
}

function* watchDocsOutCall() {
  yield takeEvery(TRIGGER_DOCS_OUT_SAGA, makeDocsOutStagerCall);
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
  fetchDashboardData,
  fireSnackBar,
  watchDashboardDataFetch,
  watchTableCheckboxSelect,
  watchOrderCall,
  makeOrderBpmCall,
  onCheckboxSelect,
};

export function* combinedSaga() {
  yield all([
    watchDashboardCountsFetch(),
    watchDashboardDataFetch(),
    watchTableCheckboxSelect(),
    watchOrderCall(),
    watchDocsOutCall(),
  ]);
}

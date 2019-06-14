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
import * as R from 'ramda';
import { selectors as loginSelectors } from 'ducks/login/index';
import {
  GET_DASHBOARD_COUNTS_SAGA,
  GET_DOWNLOAD_DATA_SAGA,
  SET_STAGER_DATA_COUNTS,
  GET_DASHBOARD_DATA_SAGA,
  SET_STAGER_DATA,
  SET_STAGER_DATA_LOADING,
  TABLE_CHECKBOX_SELECT,
  TABLE_CHECKBOX_SELECT_TRIGGER,
  TRIGGER_ORDER_SAGA,
  TRIGGER_DISPOSITION_OPERATION_SAGA,
  SET_STAGER_ACTIVE_SEARCH_TERM,
  SET_DOC_GEN_RESPONSE,
  SET_DOWNLOAD_DATA,

} from './types';
import selectors from './selectors';
import Disposition from '../../../models/Disposition';
import { SET_SNACK_BAR_VALUES_SAGA } from '../notifications/types';

function buildDateObj(stagerType, stagerStartEndDate, searchTerm, stagerPageOffSet, maxFetchCount) {
  const fromDate = R.propOr({}, 'fromDate', stagerStartEndDate);
  const toDate = R.propOr({}, 'toDate', stagerStartEndDate);
  const dateValue = {
    fromDate,
    toDate,
    stagerType,
    searchTerm,
    stagerPageOffSet,
    maxFetchCount,
  };
  return dateValue;
}
function* fetchDashboardCounts() {
  try {
    const stagerType = yield select(selectors.getStagerValue);
    const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
    const dateValue = buildDateObj(stagerType, stagerStartEndDate, null);
    const response = yield call(Api.callPost, 'api/stager/dashboard/getCountsByDate', dateValue);
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
    const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
    const stagerPageOffSet = yield select(selectors.getStagerPageCount);
    const stagerPageOffValue = R.propOr({}, 'PageCount', stagerPageOffSet);
    const maxFetchCount = R.propOr({}, 'maxFetchCount', stagerPageOffSet);
    const dateValue = buildDateObj(
      stagerType, stagerStartEndDate,
      searchTerm, stagerPageOffValue,
      maxFetchCount,
    );
    const response = yield call(Api.callPost, 'api/stager/dashboard/getDataByDate', dateValue);
    yield put({
      type: SET_STAGER_ACTIVE_SEARCH_TERM,
      payload: searchTerm,
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

function* fetchDownloadData(callBack) {
  try {
    const stagerType = yield select(selectors.getStagerValue);
    const searchTerm = yield select(selectors.getActiveSearchTerm);
    const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
    const dateValue = buildDateObj(stagerType, stagerStartEndDate, searchTerm);
    const response = yield call(Api.callPost, 'api/stager/dashboard/downloadDataByDate', dateValue);
    if (response != null) {
      yield put({
        type: SET_DOWNLOAD_DATA,
        payload: response,
      });
      callBack.payload.call();
    }
  } catch (e) {
    yield put({
      type: SET_DOWNLOAD_DATA,
      payload: {},
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

function* setDocGenData(data) {
  yield put({
    type: SET_DOC_GEN_RESPONSE,
    payload: data,
  });
}

function* makeOrderBpmCall(payload, endPoint) {
  try {
    const snackBar = {};
    snackBar.message = 'Ordering. Please wait... ';
    snackBar.type = 'message';
    snackBar.open = true;
    yield call(fireSnackBar, snackBar);
    const response = yield call(Api.callPost, `api/stager/stager/dashboard/order/${endPoint}`, payload.payload);
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

function* makeDispositionOperationCall(payload) {
  try {
    const docGenAction = yield select(selectors.getdocGenAction);
    const stagerValue = yield select(selectors.getStagerValue);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const response = yield call(Api.callPost, `api/disposition/disposition/bulk?assignedTo=${userPrincipalName}&group=${payload.payload.group}&disposition=${docGenAction}`, { taskList: payload.payload.taskList });
    const prevResponse = yield select(selectors.getdocGenResponse);
    const prevSuccessList = !R.isNil(prevResponse.hitLoans) ? prevResponse.hitLoans : [];
    const latestSuccessList = R.concat(prevSuccessList, response.hitLoans || []);
    response.hitLoans = latestSuccessList;
    const errorMessages = Disposition.getBulkErrorMessages(response.missedLoans || []);
    response.missedLoans = errorMessages;
    yield call(fetchDashboardCounts);
    const activeSearchTerm = yield select(selectors.getActiveSearchTerm);
    yield call(fetchDashboardData, {
      payload:
        { activeSearchTerm, stager: stagerValue },
    });
    yield call(onCheckboxSelect, { payload: [] });
    yield call(setDocGenData, response);
  } catch (err) {
    const snackBarData = {};
    snackBarData.message = 'Something went wrong!!';
    snackBarData.type = 'error';
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
}

function* watchDispositionOperationCall() {
  yield takeEvery(TRIGGER_DISPOSITION_OPERATION_SAGA, makeDispositionOperationCall);
}

function* watchDashboardDataFetch() {
  yield takeEvery(GET_DASHBOARD_DATA_SAGA, fetchDashboardData);
}

function* watchDownloadDataFetch() {
  yield takeEvery(GET_DOWNLOAD_DATA_SAGA, fetchDownloadData);
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
    watchDownloadDataFetch(),
    watchDashboardDataFetch(),
    watchTableCheckboxSelect(),
    watchOrderCall(),
    watchDispositionOperationCall(),
  ]);
}

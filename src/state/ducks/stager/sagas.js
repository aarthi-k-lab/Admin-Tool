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
import {
  selectors as loginSelectors,
} from 'ducks/login/index';
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
  SEARCH_STAGER_LOAN_NUMBER,
  GET_STAGER_LOAN_NUMBER,
  SET_STAGER_LOAN_NUMBER,
  FETCH_STAGER_PAYLOAD,
} from './types';

import selectors from './selectors';
import Disposition from '../../../models/Disposition';
import {
  SET_SNACK_BAR_VALUES_SAGA,
} from '../notifications/types';

function buildDateObj(stagerType, stagerStartEndDate, searchTerm) {
  const fromDateMoment = R.propOr({}, 'fromDate', stagerStartEndDate);
  const toDateMoment = R.propOr({}, 'toDate', stagerStartEndDate);
  const fromDate = new Date(fromDateMoment).toISOString();
  const toDate = new Date(toDateMoment).toISOString();
  const dateValue = {
    fromDate,
    toDate,
    stagerType,
    searchTerm,
  };
  return dateValue;
}

function* fetchDashboardCounts() {
  try {
    const user = yield select(loginSelectors.getUser);
    if (!R.isEmpty(user)) {
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
    const { payload: searchDetails } = data;
    const {
      top, page, orderby, orderType, filter,
    } = searchDetails;
    yield put({
      type: SET_STAGER_DATA_LOADING,
      payload: {
        error: false,
        loading: true,
      },
    });
    const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
    const azureSearchToggle = yield select(selectors.getAzureSearchToggle);
    let requestPayload = {};
    if (azureSearchToggle) {
      requestPayload = {
        searchTerm,
        stagerType,
        top,
        page,
        orderby,
        orderType,
        filter,
        azureSearchToggle,
      };
    } else {
      requestPayload = buildDateObj(stagerType,
        stagerStartEndDate,
        searchTerm);
    }
    const response = yield call(Api.callPost, 'api/stager/dashboard/getDataByDate', requestPayload);
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

function* fetchStagerPayload() {
  const activeSearchTerm = yield select(selectors.getActiveSearchTerm);
  const stager = yield select(selectors.getStagerValue);
  const data = {
    payload: {
      activeSearchTerm,
      stager,
      top: 100,
      page: 1,
    },
  };
  yield call(fetchDashboardData, data);
}

function* fetchDownloadData(callBack) {
  try {
    const stagerType = yield select(selectors.getStagerValue);
    const searchTerm = yield select(selectors.getActiveSearchTerm);
    const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
    const azureSearchToggle = yield select(selectors.getAzureSearchToggle);
    const dateValue = buildDateObj(stagerType, stagerStartEndDate, searchTerm);
    const downloadPayload = {
      ...dateValue,
      azureSearchToggle,
    };
    const response = yield call(Api.callPost, 'api/stager/dashboard/downloadDataByDate', downloadPayload);
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

function* makeOrderBpmCall(payload) {
  try {
    const snackBar = {};
    snackBar.message = 'Ordering. Please wait... ';
    snackBar.type = 'message';
    snackBar.open = true;
    yield call(fireSnackBar, snackBar);
    const response = yield call(Api.callPost, `api/stager/stager/dashboard/order/${payload.endPoint}`, payload.payload);
    const failedResponse = response ? response.filter(data => data.error === true) : [];
    yield call(fetchDashboardCounts);
    const activeSearchTerm = yield select(selectors.getActiveSearchTerm);
    const stager = yield select(selectors.getStagerValue);
    const stagerPayload = {
      activeSearchTerm,
      stager,
    };
    yield call(fetchDashboardData, {
      payload: stagerPayload,
    });
    yield call(onCheckboxSelect, {
      payload: [],
    });
    if (failedResponse && failedResponse.length > 0) {
      const snackBarData = {};
      if (R.any(data => R.contains('Ordering in Progress.', data.message), failedResponse)) {
        snackBarData.message = 'Ordering in Progress...';
        snackBarData.type = 'warning';
        snackBarData.open = true;
      } else if (failedResponse.length > 5) {
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
  }
}

function* makeStagerSearchLoanCall(payload) {
  try {
    const searchLoanNumber = payload.payload;
    const stagerType = yield select(selectors.getStagerValue);
    const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
    const dateValue = buildDateObj(stagerType, stagerStartEndDate, null);
    dateValue.loanNumber = searchLoanNumber;
    const response = yield call(Api.callPost, '/api/stager/dashboard/getSearchLoanNumber', dateValue);
    yield put({
      type: SEARCH_STAGER_LOAN_NUMBER,
      payload: response,
    });
    yield put({
      type: SET_STAGER_LOAN_NUMBER,
      payload: searchLoanNumber,
    });
  } catch (err) {
    yield put({
      type: SEARCH_STAGER_LOAN_NUMBER,
      payload: {},
    });
  }
}

function* makeDispositionOperationCall(payload) {
  try {
    const docGenAction = yield select(selectors.getdocGenAction);
    const stagerValue = yield select(selectors.getStagerValue);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const response = yield call(Api.callPost, `api/disposition/disposition/bulk?assignedTo=${userPrincipalName}&group=${payload.payload.group}&disposition=${docGenAction}`, {
      taskList: payload.payload.taskList,
    });
    const prevResponse = yield select(selectors.getdocGenResponse);
    const prevSuccessList = !R.isNil(prevResponse.hitLoans) ? prevResponse.hitLoans : [];
    const latestSuccessList = R.concat(prevSuccessList, response.hitLoans || []);
    response.hitLoans = latestSuccessList;
    const errorMessages = Disposition.getBulkErrorMessages(response.missedLoans || []);
    response.missedLoans = errorMessages;
    yield call(fetchDashboardCounts);
    const activeSearchTerm = yield select(selectors.getActiveSearchTerm);
    yield call(fetchDashboardData, {
      payload: {
        activeSearchTerm,
        stager: stagerValue,
      },
    });
    yield call(onCheckboxSelect, {
      payload: [],
    });
    yield call(setDocGenData, response);
  } catch (err) {
    const snackBarData = {};
    snackBarData.message = 'Something went wrong!!';
    snackBarData.type = 'error';
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
}

function* watchDashboardCountsFetch() {
  yield takeEvery(GET_DASHBOARD_COUNTS_SAGA, fetchDashboardCounts);
}

function* watchOrderCall() {
  yield takeEvery(TRIGGER_ORDER_SAGA, makeOrderBpmCall);
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

function* watchStagerSearchLoanCall() {
  yield takeEvery(GET_STAGER_LOAN_NUMBER, makeStagerSearchLoanCall);
}


function* watchfetchStagerPayload() {
  yield takeEvery(FETCH_STAGER_PAYLOAD, fetchStagerPayload);
}

export const TestExports = {
  watchDashboardCountsFetch,
  watchDashboardDataFetch,
  watchDownloadDataFetch,
  watchTableCheckboxSelect,
  watchOrderCall,
  watchDispositionOperationCall,
  watchStagerSearchLoanCall,
  fetchDashboardCounts,
  fetchDashboardData,
  fetchDownloadData,
  onCheckboxSelect,
  makeOrderBpmCall,
  makeDispositionOperationCall,
  makeStagerSearchLoanCall,
  fireSnackBar,
  setDocGenData,
};

export function* combinedSaga() {
  yield all([
    watchDashboardCountsFetch(),
    watchDownloadDataFetch(),
    watchDashboardDataFetch(),
    watchTableCheckboxSelect(),
    watchOrderCall(),
    watchDispositionOperationCall(),
    watchStagerSearchLoanCall(),
    watchfetchStagerPayload(),
  ]);
}

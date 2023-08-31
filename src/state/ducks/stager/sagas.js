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
import { selectors as dashboardSelectors } from 'ducks/dashboard/index';
import { selectors as checklistSelectors } from 'ducks/tasks-and-checklist/index';
import { ERROR, SUCCESS } from 'constants/common';
import { statusMessage } from 'constants/stager';
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
  SAVE_DELAY_CHECKLIST_DATA,
  FETCH_DELAY_CHECKLIST_HISTORY,
  REFRESH_STAGER_TILE,
} from './types';

import selectors from './selectors';
import Disposition from '../../../models/Disposition';
import {
  SET_SNACK_BAR_VALUES_SAGA,
} from '../notifications/types';
import { storeDelayCheckList, storeDelayCheckListHistory } from './actions';

function buildDateObj(stagerType, stagerStartEndDate, searchTerm, brandName = null) {
  const fromDateMoment = R.propOr({}, 'fromDate', stagerStartEndDate);
  const toDateMoment = R.propOr({}, 'toDate', stagerStartEndDate);
  const fromDate = new Date(fromDateMoment).toISOString();
  const toDate = new Date(toDateMoment).toISOString();
  let dateValue = {
    fromDate,
    toDate,
    stagerType,
    searchTerm,
  };
  if (brandName) {
    dateValue = { ...dateValue, brandName };
  }
  return dateValue;
}

function* fetchDashboardCounts() {
  try {
    const user = yield select(loginSelectors.getUser);
    if (!R.isEmpty(user)) {
      const stagerType = yield select(selectors.getStagerValue);
      const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
      const isRSHGroupPresent = (yield select(loginSelectors.isRSHGroupPresent));
      const brandName = isRSHGroupPresent ? 'RSH' : 'NSM';
      const dateValue = buildDateObj(stagerType, stagerStartEndDate, null, brandName);
      const response = yield call(Api.callPost, 'api/stager/dashboard/getCountsByDate', dateValue);
      if (response != null) {
        if (!R.contains('beuw-mgr', user.groupList)) {
          response.counts = response.counts.map(x => ({
            ...x,
            data: R.filter(data => data.displayName !== 'Delay Checklist', x.data),
          }));
        }
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
    const stagerType = yield select(selectors.getStagerValue);
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
    const stagerValue = yield select(selectors.getStagerValue);
    const fromDateMoment = R.propOr({}, 'fromDate', stagerStartEndDate);
    const toDateMoment = R.propOr({}, 'toDate', stagerStartEndDate);
    const fromDate = new Date(fromDateMoment).toISOString();
    const toDate = new Date(toDateMoment).toISOString();
    const isRSHGroupPresent = (yield select(loginSelectors.isRSHGroupPresent));
    const brandName = isRSHGroupPresent ? 'RSH' : 'NSM';
    let requestPayload = {};
    let stagerSchedulerResponse = {};
    const stagerFetchCriteria = {
      stagerTaskStatus: ['Ordered', 'Completed'],
      stagerTaskType: ['Escrow', 'Legal Fee', 'Value', 'Reclass'],
      stagerValue: ['UW_STAGER', 'DOCGEN_STAGER', 'ALL'],
    };
    if (azureSearchToggle) {
      requestPayload = {
        searchTerm,
        stagerType,
        top,
        page,
        orderby,
        orderType,
        filter,
        fromDate,
        toDate,
        azureSearchToggle,
        brandName,
      };
    } else {
      requestPayload = buildDateObj(stagerType,
        stagerStartEndDate,
        searchTerm, brandName);
    }
    const response = yield call(Api.callPost, 'api/stager/dashboard/getDataByDate', requestPayload);
    yield put({
      type: SET_STAGER_ACTIVE_SEARCH_TERM,
      payload: searchTerm,
    });
    if (response != null) {
      const { stagerTaskType, stagerTaskStatus, totalRecords } = response;
      const stagerReqBody = {
        stagerTaskType,
        stagerTaskStatus,
        stagerValue,
      };
      if (stagerFetchCriteria.stagerTaskType.includes(stagerTaskType)
        && stagerFetchCriteria.stagerTaskStatus.includes(stagerTaskStatus)
        && stagerFetchCriteria.stagerValue.includes(stagerValue)
        && totalRecords > 0) {
        stagerSchedulerResponse = yield call(Api.callPost, 'api/dataservice/api/getStagerSchedulerTime', stagerReqBody);
      }
      payload = {
        error: false,
        data: { ...response, lastUpdatedDate: R.propOr(null, 'lastUpdatedDate', stagerSchedulerResponse) },
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
    const isRSHGroupPresent = (yield select(loginSelectors.isRSHGroupPresent));
    const brandName = isRSHGroupPresent ? 'RSH' : 'NSM';
    const dateValue = buildDateObj(stagerType, stagerStartEndDate, searchTerm, brandName);
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
        snackBarData.type = ERROR;
        snackBarData.open = true;
      } else {
        snackBarData.message = 'Order call failed for Eval ID(s): ';
        snackBarData.type = ERROR;
        snackBarData.open = true;
        const failedEvalIds = failedResponse.map(failedData => failedData.data.evalId);
        snackBarData.message += failedEvalIds.toString();
      }
      yield call(fireSnackBar, snackBarData);
    } else {
      const snackBarData = {};
      snackBarData.message = 'Ordered Successfully!';
      snackBarData.type = SUCCESS;
      snackBarData.open = true;
      yield call(fireSnackBar, snackBarData);
    }
  } catch (e) {
    const snackBarData = {};
    snackBarData.message = 'Something went wrong!!';
    snackBarData.type = ERROR;
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
}

function* makeStagerSearchLoanCall(payload) {
  try {
    const searchLoanNumber = payload.payload;
    const stagerType = yield select(selectors.getStagerValue);
    const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
    const isRSHGroupPresent = (yield select(loginSelectors.isRSHGroupPresent));
    const brandName = isRSHGroupPresent ? 'RSH' : 'NSM';
    const dateValue = buildDateObj(stagerType, stagerStartEndDate, null, brandName);
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
    snackBarData.type = ERROR;
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
}

export const saveDelayChecklistDataToDB = function* saveDelayChecklistDataToDB() {
  try {
    const evalId = yield select(dashboardSelectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const disposition = yield select(checklistSelectors.getDisposition);
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const taskId = yield select(dashboardSelectors.taskId);
    const userEmail = R.pathOr('', ['userDetails', 'email'], user);
    const reasons = R.pathOr([], [0], disposition);
    const tkamsPayload = {
      evalId: R.is(String, evalId) ? Number(evalId) : evalId,
      completedBy: userEmail,
      reasons,
    };
    const details = R.is(Array, reasons) && R.length(reasons) ? reasons
      .map((rec, index) => ({ delayCheckListReason: rec, delayLineItemNumber: index + 1 })) : [];
    const CMODPayload = {
      taskId,
      evalId: R.is(String, evalId) ? Number(evalId) : evalId,
      loanNumber,
      completedDate: new Date().toISOString(),
      completedByUserName: userEmail,
      letterSentDate: null,
      letterExpiryDate: null,
      recordCreatedByUser: userEmail,
      recordCreatedDate: '',
      details,
    };
    yield call(Api.callPost, '/api/cmodnetcoretkams/DelayChecklist/Create', tkamsPayload);
    // TODO check if saved in TKAMS
    const cmodRes = yield call(Api.callPost, '/api/dataservice/delayCheckList', CMODPayload);
    if (cmodRes) {
      yield put(storeDelayCheckList(cmodRes));
      yield put({ type: FETCH_DELAY_CHECKLIST_HISTORY });
    } else {
      yield call(fireSnackBar, {
        message: 'Something went wrong!!',
        type: ERROR,
        open: true,
      });
    }
  } catch (e) {
    const snackBarData = {};
    snackBarData.message = 'Something went wrong!!';
    snackBarData.type = ERROR;
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
};

export const fetchDelayCheckListHistory = function* fetchDelayCheckListHistory() {
  try {
    let evalId = yield select(dashboardSelectors.evalId);
    if (!evalId) {
      const evalCaseDetails = yield select(dashboardSelectors.getEvalCaseDetails);
      evalId = evalCaseDetails.length && evalCaseDetails[0].evalId;
    }
    const checkListHistory = yield call(Api.callGet, `/api/dataservice/delayCheckList/history/${evalId}`);
    if (checkListHistory) {
      yield put(storeDelayCheckListHistory(checkListHistory));
    } else {
      yield put(storeDelayCheckListHistory([]));
    }
  } catch (e) {
    const snackBarData = {};
    snackBarData.message = 'Unable to fecth delay checklist History';
    snackBarData.type = ERROR;
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
};

function* refreshStagerTile() {
  try {
    const stagerType = yield select(selectors.getStagerValue);
    const stagerStartEndDate = yield select(selectors.getStagerStartEndDate);
    const activeSearchTerm = yield select(selectors.getActiveSearchTerm);
    const payload = buildDateObj(stagerType, stagerStartEndDate, activeSearchTerm);
    const response = yield call(Api.callPost, 'api/stager/dashboard/refreshStagerTile', payload);

    const statusCode = R.propOr(500, 'statusCode', response);
    const snackBarData = {
      message: R.prop(statusCode, statusMessage),
      type: R.equals(statusCode, 202) ? SUCCESS : ERROR,
      open: true,
    };
    yield call(fireSnackBar, snackBarData);
  } catch (e) {
    const snackBarData = {
      message: 'Stager refresh failed',
      type: ERROR,
      open: true,
    };
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

function* watchDoneButtonClick() {
  yield takeEvery(SAVE_DELAY_CHECKLIST_DATA, saveDelayChecklistDataToDB);
}

function* watchFetchDelayCheckListHistory() {
  yield takeEvery(FETCH_DELAY_CHECKLIST_HISTORY, fetchDelayCheckListHistory);
}

function* watchRefreshStagerTile() {
  yield takeEvery(REFRESH_STAGER_TILE, refreshStagerTile);
}

export const TestExports = {
  watchRefreshStagerTile,
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
  watchDoneButtonClick,
  watchFetchDelayCheckListHistory,
  buildDateObj,
};

export function* combinedSaga() {
  yield all([
    watchRefreshStagerTile(),
    watchDashboardCountsFetch(),
    watchDownloadDataFetch(),
    watchDashboardDataFetch(),
    watchTableCheckboxSelect(),
    watchOrderCall(),
    watchDispositionOperationCall(),
    watchStagerSearchLoanCall(),
    watchfetchStagerPayload(),
    watchDoneButtonClick(),
    watchFetchDelayCheckListHistory(),
  ]);
}

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
import moment from 'moment-timezone';
import ReasonableEffort from 'models/ReasonableEffort';
import DashboardModel from 'models/Dashboard';
import * as Api from 'lib/Api';
import { ERROR, SUCCESS, FAILED } from '../../../constants/common';
import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
  FETCH_TOMBSTONE_DATA,
  GET_RFD_DROPDOWN_DATA,
  SET_RFD_DROPDOWN_DATA,
  SAVE_RFD_REQUEST,
  SAVE_RFD_RESPONSE,
  TOGGLE_LOADER,
  APPEND_RFD_SAVE_DATA,
  SAVE_PROPERTY_PRIMARY_USE_DROPDOWN,
  POPULATE_COLLATERAL_DROPDOWN,
  POPULATE_COLLATERAL_DATA,
  FETCH_COLLATERAL_DATA,
  ADD_LIEN_LOAN_BALANCE,
  SAVE_COLLATERAL_DATA,
  SET_RFDTABLE_DATA,
  GET_RFDTABLE_DATA,
  UPDATE_RFD,
  TOGGLE_VIEW,
  REFRESH_LIEN_BALANCES,
  POPULATE_LIEN_BALANCES,
  POPULATE_PROPERTY_VALUATIONS,
  UPDATE_OCCUPANCY,
  GET_REASONABLE_EFFORT_DATA,
  SET_REASONABLE_EFFORT_DATA,
  SET_REASONABLE_EFFORT_MIS_DOC_DATA,
  GET_REASONABLE_EFFORT_HISTORY_DATA,
  SET_REASONABLE_EFFORT_HISTORY_DATA,
  GET_REASONABLE_EFFORT_DATA_BY_ID,
  GET_CFPBTABLE_DATA,
  SET_CFPBTABLE_DATA,
} from './types';
import { selectors as dashboardSelectors } from '../dashboard';
import { selectors as loginSelectors } from '../login';
import { selectors as loanTombstoneSelectors } from '.';
import {
  SET_RESOLUTION_AND_INVSTR_HRCHY, SET_BRAND, STORE_INVEST_CD_AND_BRAND_NM,
  SET_RESULT_OPERATION, SET_POPUP_DATA, SET_LOAN_TYPE, SET_WATERFALLID,
} from '../dashboard/types';
import { PROPERTY_PRIMARY_USE } from '../../../constants/collaterlUI';
import {
  COLLATERAL_ERROR,
  COLLATERAL_SUCCESS_MSG,
  EXCEPTION, LOAN_LIEN_ERROR,
  NO_DATA,
  RFD_ERROR,
  SAVE_ERROR,
  REASONABLE_EFFORT_FETCH_ERROR,
  REASONABLE_EFFORT_HISTORY_FETCH_ERROR,
} from '../../../constants/loanInfoComponents';

function* fetchTombstoneData(payload) {
  const { taskName, taskId } = payload.payload;
  yield put({ type: LOADING_TOMBSTONE_DATA });

  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const evalId = yield select(dashboardSelectors.evalId);
  const groupName = yield select(dashboardSelectors.groupName);
  const postModTaskName = yield select(dashboardSelectors.stagerTaskName);
  const selectedResolutionId = yield select(dashboardSelectors.selectedResolutionId);
  const brand = yield select(dashboardSelectors.brand);
  const tombstoneTaskId = R.equals(groupName, 'BOOKING') ? yield select(dashboardSelectors.getBookingTaskId) : taskId;
  try {
    const userGroup = R.equals(groupName, 'POSTMOD') || R.equals(groupName, 'UWSTAGER') ? postModTaskName.activeTile : groupName;
    const group = userGroup === 'Recordation' || userGroup === 'Countersign' || userGroup === 'Delay Checklist' ? taskName : userGroup;

    const data = yield call(LoanTombstone.fetchData,
      loanNumber, evalId, group, taskName, tombstoneTaskId, brand, selectedResolutionId);
    const {
      resolutionId, investorHierarchy, tombstoneData, investorCode, brandName,
      loanType, waterfallId,
    } = data;

    yield put({
      type: STORE_INVEST_CD_AND_BRAND_NM,
      payload: { investorCode, brandName },
    });
    // storing resolution id inside dashboard object
    yield put({
      type: SET_BRAND,
      payload: brandName,
    });
    yield put({
      type: SET_RESOLUTION_AND_INVSTR_HRCHY,
      payload: { resolutionId, investorHierarchy },
    });
    yield put({
      type: SET_LOAN_TYPE,
      payload: loanType,
    });
    yield put({
      type: SET_WATERFALLID,
      payload: waterfallId,
    });
    if (R.has('modViewData', tombstoneData)) {
      yield put(yield call(setPaymentDeferral,
        R.contains(DashboardModel.PDD, tombstoneData.modViewData)));
    }
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

function* populateCollateralDropdown(payload) {
  try {
    const responseMapper = item => ({
      portfolioCode: item.className,
      requestType: item.classCode,
      activeIndicator: item.activeIndicator,
      displayText: item.classCode,
    });
    const type = R.propOr('', 'payload', payload);
    let response = yield call(Api.callGet, `/api/dataservice/api/classCodes/${type}`);
    if (response && response.length > 0) {
      response = R.map(responseMapper, response);
    }
    if (type === PROPERTY_PRIMARY_USE) {
      yield put({
        type: SAVE_PROPERTY_PRIMARY_USE_DROPDOWN,
        payload: response,
      });
    }
  } catch (e) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        level: FAILED,
        status: COLLATERAL_ERROR,
      },
    });
  }
}

function* populateCollateralData() {
  try {
    const responseMapper = item => ({
      numberOfUnits: item.numberOfUnits,
      assetManagerCollateralValue: item.assetManagerCollateralValue,
      seniorClaim: item.seniorClaim,
      lienLoanBalances: item.lienLoanBalances,
      primaryUse: item.primaryUse,
    });
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    let response = yield call(Api.callGet, `/api/cmodnetcoretkams/Collateral/${loanNumber}`);
    const propVal = yield call(Api.callGet, `/api/tkams/propertyvaluation/getPropertyValuationDetails/${loanNumber}`);
    if (response && response.length > 0 && propVal) {
      response = R.map(responseMapper, response);
    }
    yield put({
      type: POPULATE_COLLATERAL_DATA,
      payload: response,
    });
    yield put({
      type: POPULATE_PROPERTY_VALUATIONS,
      payload: propVal,
    });
  } catch (e) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        level: FAILED,
        status: COLLATERAL_ERROR,
      },
    });
  }
}

function* addLienLoanBalance(action) {
  try {
    const userPrincipalName = yield select(loginSelectors.getUserPrincipalName);
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const loanBalance = action.payload;
    const payload = {
      user: userPrincipalName,
      LoanBalance: loanBalance,
      LoanId: loanNumber,
    };
    const response = yield call(Api.callPost, '/api/cmodnetcoretkams/Collateral/AddLienLoanBalance', payload);
    if (response) {
      yield put({
        type: REFRESH_LIEN_BALANCES,
      });
    }
  } catch (e) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        level: FAILED,
        status: LOAN_LIEN_ERROR,
      },
    });
  }
}

function* refreshLienBalance() {
  try {
    const responseMapper = item => ({
      lienLoanBalances: item.lienLoanBalances,
    });
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    let response = yield call(Api.callGet, `/api/cmodnetcoretkams/Collateral/${loanNumber}`);
    if (response && response.length > 0) {
      response = R.map(responseMapper, response);
    }
    yield put({
      type: POPULATE_LIEN_BALANCES,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        level: FAILED,
        status: COLLATERAL_ERROR,
      },
    });
  }
}


function* saveCollateralData(action) {
  try {
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const collateralData = action.payload;
    const { payload: { occupancyType } } = action;
    const payload = {
      ...collateralData,
      primaryUse: occupancyType,
    };
    const response = yield call(Api.callPost, `/api/cmodnetcoretkams/Collateral/Save/${loanNumber}`, payload);
    if (response) {
      yield put({
        type: UPDATE_OCCUPANCY,
        payload: occupancyType,
      });
      yield put({
        type: TOGGLE_VIEW,
      });
      yield put({
        type: FETCH_COLLATERAL_DATA,
      });
      yield put({
        type: SET_POPUP_DATA,
        payload: {
          message: COLLATERAL_SUCCESS_MSG,
          level: SUCCESS,
          title: 'Success!',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        level: FAILED,
        status: SAVE_ERROR,
      },
    });
  }
}


const getRFDReasonDescDropdown = function* getRFDReasonDescDropdown() {
  try {
    const responseMapper = item => ({
      value: item.classCode,
      reason: item.shortDescription,
    });
    const defaultOptions = {
      value: '',
      reason: 'Select Reason Description',
    };
    let response = yield call(Api.callGet, '/api/dataservice/api/classCodes/RFD');
    if (response && response.length > 0) {
      response = R.map(responseMapper, response);
      response.unshift(defaultOptions);
    }
    yield put({
      type: SET_RFD_DROPDOWN_DATA,
      payload: response,
    });
    if (!response) {
      yield put({
        type: SET_RFD_DROPDOWN_DATA,
        payload: NO_DATA,
      });
    }
  } catch (e) {
    yield put({
      type: SET_RFD_DROPDOWN_DATA,
      payload: RFD_ERROR,
    });
  }
};

const getRFDTableData = function* getRFDTableData() {
  try {
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const brand = yield select(dashboardSelectors.brand);
    yield put({
      type: TOGGLE_LOADER,
      payload: true,
    });
    const response = yield call(Api.callGet, `/api/utility/
RFD?loanId=${loanNumber}&brand=${brand}`);
    yield put({
      type: SET_RFDTABLE_DATA,
      payload: response,
    });
    if (!response) {
      yield put({
        type: SET_RFDTABLE_DATA,
        payload: [],
      });
    }
    yield put({
      type: TOGGLE_LOADER,
      payload: false,
    });
  } catch (e) {
    yield put({
      type: SET_RFDTABLE_DATA,
      payload: [],
    });
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: RFD_ERROR,
      },
    });
  }
};

const saveRFDDetails = function* saveRFDDetails(action) {
  try {
    yield put({
      type: TOGGLE_LOADER,
      payload: true,
    });
    const rfdDetails = action.payload;
    const brand = yield select(dashboardSelectors.brand);
    const userPrincipalName = yield select(loginSelectors.getUserPrincipalName);
    const { payload: { reasonForDefault } } = action;
    const payload = {
      ...rfdDetails,
      user: userPrincipalName,
      brand,
    };
    const currentDate = new Date();
    const response = yield call(Api.callPost, '/api/utility/RFD', payload);
    if (response && R.prop('loanId', response) && R.prop('reasonForDefaultCode', response)) {
      yield put({
        type: APPEND_RFD_SAVE_DATA,
        payload: {
          date: currentDate,
          userName: userPrincipalName,
          reasonDescription: rfdDetails.reasonForDefault,
          comments: rfdDetails.comments,
        },
      });
    }
    yield put({
      type: TOGGLE_LOADER,
      payload: false,
    });
    const rfdCurrentData = yield select(loanTombstoneSelectors.getRFDTableData);
    if (rfdCurrentData) {
      yield put({
        type: UPDATE_RFD,
        payload: reasonForDefault,
      });
      yield put({
        type: TOGGLE_VIEW,
      });
    }
  } catch (e) {
    yield put({
      type: SAVE_RFD_RESPONSE,
      payload: EXCEPTION,
    });
  }
};

const getCFPBTableData = function* getCFPBTableData() {
  try {
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    yield put({
      type: TOGGLE_LOADER,
      payload: true,
    });
    const response = yield call(Api.callGet, `api/tkams/search/CFPBDelinquencyTrackingInfo/${loanNumber}`);
    yield put({
      type: SET_CFPBTABLE_DATA,
      payload: response,
    });
    if (!response) {
      yield put({
        type: SET_CFPBTABLE_DATA,
        payload: [],
      });
    }
    yield put({
      type: TOGGLE_LOADER,
      payload: false,
    });
  } catch (e) {
    yield put({
      type: SET_CFPBTABLE_DATA,
      payload: [],
    });
  }
};

function* getReasonableEffort() {
  try {
    const evalId = yield select(dashboardSelectors.evalId);
    const response = yield call(Api.callGet, `/api/tkams/search/getReasonableEffortsData/${evalId}`);
    const reasonableEffortData = yield call(ReasonableEffort.getReasonableEffortItems,
      response);
    const responseMapper = item => ({
      letterType: item.letterType,
      letterSentdate: !R.isNil(item.dateLtrSent) ? moment(item.dateLtrSent).format('MM/DD/YYYY') : '-',
      deadlineDate: !R.isNil(item.bcMissingDocDeadlineDate) ? moment(item.bcMissingDocDeadlineDate).format('MM/DD/YYYY') : '-',
      exclReason: item.exclReason,
    });
    let missDocData = R.pathOr([], ['missingDocsInfo'], response);
    if (missDocData && missDocData.length > 0) {
      missDocData = R.map(responseMapper, missDocData);
    }
    yield put({
      type: SET_REASONABLE_EFFORT_DATA,
      payload: reasonableEffortData,
    });
    yield put({
      type: SET_REASONABLE_EFFORT_MIS_DOC_DATA,
      payload: missDocData,
    });
    yield put({
      type: TOGGLE_LOADER,
      payload: false,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: REASONABLE_EFFORT_FETCH_ERROR,
      },
    });
  }
}


function* getReasonableEffortHistoryData() {
  try {
    const evalId = yield select(dashboardSelectors.evalId);
    const reasonableEffortData = yield select(loanTombstoneSelectors.getReasonableEffortData);
    const reasonableEffortId = R.pathOr('', ['content'], R.find(R.propEq('title', 'Reasonable Effort ID'))(R.pathOr({}, ['data'], reasonableEffortData)));
    const response = yield call(Api.callGet, `/api/tkams/search/getReasonableEffortHistory/${evalId}/${reasonableEffortId}`);
    yield put({
      type: SET_REASONABLE_EFFORT_HISTORY_DATA,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: REASONABLE_EFFORT_HISTORY_FETCH_ERROR,
      },
    });
  }
}

function* getReasonableEffortById(action) {
  try {
    const reasonableEffortId = action.payload;
    const evalId = yield select(dashboardSelectors.evalId);
    const response = yield call(Api.callGet, `/api/tkams/search/getReasonableEffortDataUsingId/${evalId}/${reasonableEffortId}`);
    const reasonableEffortData = yield call(ReasonableEffort.getReasonableEffortItems,
      response);
    yield put({
      type: SET_REASONABLE_EFFORT_DATA,
      payload: reasonableEffortData,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: REASONABLE_EFFORT_FETCH_ERROR,
      },
    });
  }
}


function* watchTombstone() {
  yield takeEvery(FETCH_TOMBSTONE_DATA, fetchTombstoneData);
}

function* watchGetRFDReasonDescDropdown() {
  yield takeEvery(GET_RFD_DROPDOWN_DATA, getRFDReasonDescDropdown);
}

function* watchsaveRFDDetails() {
  yield takeEvery(SAVE_RFD_REQUEST, saveRFDDetails);
}

function* watchCollateralPopulateDropdownEvents() {
  yield takeEvery(POPULATE_COLLATERAL_DROPDOWN, populateCollateralDropdown);
}

function* watchCollateralDataEvents() {
  yield takeEvery(FETCH_COLLATERAL_DATA, populateCollateralData);
}

function* watchLienLoanBalances() {
  yield takeEvery(REFRESH_LIEN_BALANCES, refreshLienBalance);
}

function* watchAddLienLoanBalance() {
  yield takeEvery(ADD_LIEN_LOAN_BALANCE, addLienLoanBalance);
}

function* watchSaveCollateralData() {
  yield takeEvery(SAVE_COLLATERAL_DATA, saveCollateralData);
}

function* watchGetRFDTableData() {
  yield takeEvery(GET_RFDTABLE_DATA, getRFDTableData);
}

function* watchGetReasonableEffortData() {
  yield takeEvery(GET_REASONABLE_EFFORT_DATA, getReasonableEffort);
}


function* watchGetReasonableEffortHistoryData() {
  yield takeEvery(GET_REASONABLE_EFFORT_HISTORY_DATA, getReasonableEffortHistoryData);
}

function* watchGetReasonableEffortDataById() {
  yield takeEvery(GET_REASONABLE_EFFORT_DATA_BY_ID, getReasonableEffortById);
}

function* watchGetCFPBTableData() {
  yield takeEvery(GET_CFPBTABLE_DATA, getCFPBTableData);
}

export const TestExports = {
  fetchTombstoneData,
  watchTombstone,
};

// eslint-disable-next-line
export const combinedSaga = function* combinedSaga() {
  yield all([
    watchTombstone(),
    watchGetRFDReasonDescDropdown(),
    watchsaveRFDDetails(),
    watchCollateralPopulateDropdownEvents(),
    watchCollateralDataEvents(),
    watchAddLienLoanBalance(),
    watchSaveCollateralData(),
    watchGetRFDTableData(),
    watchLienLoanBalances(),
    watchGetReasonableEffortData(),
    watchGetReasonableEffortHistoryData(),
    watchGetReasonableEffortDataById(),
    watchGetCFPBTableData(),
  ]);
};

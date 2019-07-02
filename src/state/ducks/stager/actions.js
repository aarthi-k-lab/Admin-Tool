import {
  GET_DASHBOARD_COUNTS_SAGA, GET_DASHBOARD_DATA_SAGA,
  GET_DOWNLOAD_DATA_SAGA, TABLE_CHECKBOX_SELECT_TRIGGER, TRIGGER_ORDER_SAGA,
  TRIGGER_DISPOSITION_OPERATION_SAGA, SET_DOC_GEN_ACTION, SET_STAGER_VALUE,
  SET_START_END_DATE, CLEAR_DOC_GEN_RESPONSE, SET_STAGER_GROUP,
  GET_STAGER_LOAN_NUMBER, CLEAR_SEARCH_RESPONE, CLEAR_STAGER_RESPONSE,
} from './types';

const triggerDashboardCounts = () => ({
  type: GET_DASHBOARD_COUNTS_SAGA,
});

const triggerDashboardDataFetch = payload => ({
  type: GET_DASHBOARD_DATA_SAGA,
  payload,
});

const triggerDownloadDataFetch = payload => ({
  type: GET_DOWNLOAD_DATA_SAGA,
  payload,
});

const triggerCheckboxSelect = selectedData => ({
  type: TABLE_CHECKBOX_SELECT_TRIGGER,
  payload: selectedData,
});

const triggerOrderCallAction = (payload, endPoint) => ({
  type: TRIGGER_ORDER_SAGA,
  payload,
  endPoint,
});

const triggerDispositionOperationCallAction = payload => ({
  type: TRIGGER_DISPOSITION_OPERATION_SAGA,
  payload,
});

const setDocGenAction = action => ({
  type: SET_DOC_GEN_ACTION,
  action,
});

const setStagerValue = payload => ({
  type: SET_STAGER_VALUE,
  payload,
});

const setStartEndDate = payload => ({
  type: SET_START_END_DATE,
  payload,
});

const clearDocGenAction = () => ({
  type: CLEAR_DOC_GEN_RESPONSE,
});

const clearStagerResponse = () => ({
  type: CLEAR_STAGER_RESPONSE,
});

const clearSearchResponse = () => ({
  type: CLEAR_SEARCH_RESPONE,
});

const setStagerGroup = payload => ({
  type: SET_STAGER_GROUP,
  payload,
});

const setStagerLoanNumber = payload => ({
  type: GET_STAGER_LOAN_NUMBER,
  payload,
});

export {
  triggerDashboardCounts,
  triggerDashboardDataFetch,
  triggerDownloadDataFetch,
  triggerCheckboxSelect,
  triggerOrderCallAction,
  triggerDispositionOperationCallAction,
  setDocGenAction,
  clearDocGenAction,
  setStagerValue,
  setStartEndDate,
  setStagerGroup,
  setStagerLoanNumber,
  clearSearchResponse,
  clearStagerResponse,
};

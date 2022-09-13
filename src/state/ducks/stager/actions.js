import {
  GET_DASHBOARD_COUNTS_SAGA, GET_DASHBOARD_DATA_SAGA,
  GET_DOWNLOAD_DATA_SAGA, TABLE_CHECKBOX_SELECT_TRIGGER, TRIGGER_ORDER_SAGA,
  TRIGGER_DISPOSITION_OPERATION_SAGA, SET_DOC_GEN_ACTION, SET_STAGER_VALUE,
  SET_START_END_DATE, CLEAR_DOC_GEN_RESPONSE, SET_STAGER_GROUP,
  GET_STAGER_LOAN_NUMBER, CLEAR_SEARCH_RESPONE, CLEAR_STAGER_RESPONSE,
  TRIGGER_STAGER_TILE_SAGA, TOGGLE_AZURE_SEARCH, FETCH_STAGER_PAYLOAD,
  SAVE_DELAY_CHECKLIST_DATA,
  STORE_DELAY_CHECKLIST,
  FETCH_DELAY_CHECKLIST_HISTORY,
  STORE_DELAY_CHECKLIST_HISTORY,
  REFRESH_STAGER_TILE,
} from './types';

const triggerDashboardCounts = () => ({
  type: GET_DASHBOARD_COUNTS_SAGA,
});

const refreshStagerTile = () => ({
  type: REFRESH_STAGER_TILE,
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

const onLoansSubmitAction = payload => ({
  type: TRIGGER_STAGER_TILE_SAGA,
  payload,
});

const azureSearchToggle = payload => ({
  type: TOGGLE_AZURE_SEARCH,
  payload,
});


const fetchStagerPayload = payload => ({
  type: FETCH_STAGER_PAYLOAD,
  payload,
});

const saveDelayChecklistData = payload => ({
  type: SAVE_DELAY_CHECKLIST_DATA,
  payload,
});

const storeDelayCheckList = payload => ({
  type: STORE_DELAY_CHECKLIST,
  payload,
});

const fetchDelayCheckListHistory = () => ({
  type: FETCH_DELAY_CHECKLIST_HISTORY,
});

const storeDelayCheckListHistory = payload => ({
  type: STORE_DELAY_CHECKLIST_HISTORY,
  payload,
});

export {
  fetchStagerPayload,
  azureSearchToggle,
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
  onLoansSubmitAction,
  saveDelayChecklistData,
  storeDelayCheckList,
  fetchDelayCheckListHistory,
  storeDelayCheckListHistory,
  refreshStagerTile,
};

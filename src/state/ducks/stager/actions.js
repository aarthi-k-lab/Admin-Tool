import {
  GET_DASHBOARD_COUNTS_SAGA, GET_DASHBOARD_DATA_SAGA,
  TABLE_CHECKBOX_SELECT_TRIGGER, TRIGGER_ORDER_SAGA,
  TRIGGER_DISPOSITION_OPERATION_SAGA, SET_DOCS_OUT_ACTION, SET_STAGER_VALUE,
  CLEAR_DOCS_OUT_RESPONSE,
} from './types';

const triggerDashboardCounts = () => ({
  type: GET_DASHBOARD_COUNTS_SAGA,
});

const triggerDashboardDataFetch = payload => ({
  type: GET_DASHBOARD_DATA_SAGA,
  payload,
});

const triggerCheckboxSelect = selectedData => ({
  type: TABLE_CHECKBOX_SELECT_TRIGGER,
  payload: selectedData,
});

const triggerOrderCallAction = payload => ({
  type: TRIGGER_ORDER_SAGA,
  payload,
});

const triggerDispositionOperationCallAction = payload => ({
  type: TRIGGER_DISPOSITION_OPERATION_SAGA,
  payload,
});

const setDocOutAction = action => ({
  type: SET_DOCS_OUT_ACTION,
  action,
});

const setStagerValue = payload => ({
  type: SET_STAGER_VALUE,
  payload,
});


const clearDocOutAction = () => ({
  type: CLEAR_DOCS_OUT_RESPONSE,
});

export {
  triggerDashboardCounts,
  triggerDashboardDataFetch,
  triggerCheckboxSelect,
  triggerOrderCallAction,
  triggerDispositionOperationCallAction,
  setDocOutAction,
  clearDocOutAction,
  setStagerValue,
};

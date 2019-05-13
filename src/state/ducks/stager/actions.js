import {
  GET_DASHBOARD_COUNTS_SAGA, GET_DASHBOARD_DATA_SAGA,
  TABLE_CHECKBOX_SELECT_TRIGGER, TRIGGER_ORDER_SAGA, TRIGGER_DOCS_OUT_SAGA, SET_DOCS_OUT_ACTION,
} from './types';

const triggerDashboardCounts = selectedStager => ({
  type: GET_DASHBOARD_COUNTS_SAGA,
  payload: selectedStager,
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

const triggerDocsOutCallAction = payload => ({
  type: TRIGGER_DOCS_OUT_SAGA,
  payload,
});

const setDocOutAction = action => ({
  type: SET_DOCS_OUT_ACTION,
  action,
});

export {
  triggerDashboardCounts,
  triggerDashboardDataFetch,
  triggerCheckboxSelect,
  triggerOrderCallAction,
  triggerDocsOutCallAction,
  setDocOutAction,
};

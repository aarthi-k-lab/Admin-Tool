import {
  GET_DASHBOARD_COUNTS_SAGA, GET_DASHBOARD_DATA_SAGA,
  TABLE_CHECKBOX_SELECT_TRIGGER, TRIGGER_ORDER_SAGA,
} from './types';

const triggerDashboardCounts = () => ({
  type: GET_DASHBOARD_COUNTS_SAGA,
});

const triggerDashboardDataFetch = searchTerm => ({
  type: GET_DASHBOARD_DATA_SAGA,
  payload: searchTerm,
});

const triggerCheckboxSelect = selectedData => ({
  type: TABLE_CHECKBOX_SELECT_TRIGGER,
  payload: selectedData,
});

const triggerOrderCallAction = payload => ({
  type: TRIGGER_ORDER_SAGA,
  payload,
});

export {
  // eslint-disable-next-line
  triggerDashboardCounts,
  triggerDashboardDataFetch,
  triggerCheckboxSelect,
  triggerOrderCallAction,
};

import { GET_DASHBOARD_COUNTS_SAGA, GET_DASHBOARD_DATA_SAGA } from './types';

const triggerDashboardCounts = () => ({
  type: GET_DASHBOARD_COUNTS_SAGA,
});

const triggerDashboardDataFetch = searchTerm => ({
  type: GET_DASHBOARD_DATA_SAGA,
  payload: searchTerm,
});

export {
  // eslint-disable-next-line
  triggerDashboardCounts,
  triggerDashboardDataFetch,
};

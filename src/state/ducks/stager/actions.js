import { GET_DASHBOARD_COUNTS_SAGA } from './types';

const triggerDashboardCounts = () => ({
  type: GET_DASHBOARD_COUNTS_SAGA,
});

export {
  // eslint-disable-next-line
  triggerDashboardCounts,
};

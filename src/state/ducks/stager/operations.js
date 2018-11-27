import { triggerDashboardCounts, triggerDashboardDataFetch } from './actions';

const getDashboardCounts = dispatch => () => dispatch(triggerDashboardCounts());
const getDashboardData = dispatch => searchTerm => dispatch(triggerDashboardDataFetch(searchTerm));

const operations = {
  getDashboardCounts,
  getDashboardData,
};

export default operations;

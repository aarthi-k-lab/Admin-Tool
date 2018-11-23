import { triggerDashboardCounts } from './actions';

const getDashboardCounts = dispatch => () => dispatch(triggerDashboardCounts());

const operations = {
  getDashboardCounts,
};

export default operations;

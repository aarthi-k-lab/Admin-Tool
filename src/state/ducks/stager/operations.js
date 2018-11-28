import { triggerDashboardCounts, triggerDashboardDataFetch, triggerCheckboxSelect } from './actions';

const getDashboardCounts = dispatch => () => dispatch(triggerDashboardCounts());
const getDashboardData = dispatch => searchTerm => dispatch(triggerDashboardDataFetch(searchTerm));
const onCheckBoxClick = dispatch => selectedData => dispatch(
  triggerCheckboxSelect(selectedData),
);

const operations = {
  getDashboardCounts,
  getDashboardData,
  onCheckBoxClick,
};

export default operations;

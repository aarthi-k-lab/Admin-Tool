import {
  triggerDashboardCounts, triggerDashboardDataFetch,
  triggerCheckboxSelect, triggerOrderCallAction,
} from './actions';

const getDashboardCounts = dispatch => () => dispatch(triggerDashboardCounts());
const getDashboardData = dispatch => searchTerm => dispatch(triggerDashboardDataFetch(searchTerm));
const onCheckBoxClick = dispatch => selectedData => dispatch(
  triggerCheckboxSelect(selectedData),
);
const triggerOrderCall = dispatch => payload => dispatch(triggerOrderCallAction(payload));

const operations = {
  getDashboardCounts,
  getDashboardData,
  onCheckBoxClick,
  triggerOrderCall,
};

export default operations;

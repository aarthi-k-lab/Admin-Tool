import {
  triggerDashboardCounts, triggerDashboardDataFetch,
  triggerCheckboxSelect, triggerOrderCallAction, triggerDocsOutCallAction,
} from './actions';

const getDashboardCounts = dispatch => selectedStager => dispatch(
  triggerDashboardCounts(selectedStager),
);
const getDashboardData = dispatch => payload => dispatch(triggerDashboardDataFetch(payload));
const onCheckBoxClick = dispatch => selectedData => dispatch(
  triggerCheckboxSelect(selectedData),
);
const triggerOrderCall = dispatch => payload => dispatch(triggerOrderCallAction(payload));
const triggerDocsOutCall = dispatch => payload => dispatch(triggerDocsOutCallAction(payload));

const operations = {
  getDashboardCounts,
  getDashboardData,
  onCheckBoxClick,
  triggerOrderCall,
  triggerDocsOutCall,
};

export default operations;

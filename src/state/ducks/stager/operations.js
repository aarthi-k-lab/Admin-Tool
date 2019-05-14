import {
  triggerDashboardCounts, triggerDashboardDataFetch,
  triggerCheckboxSelect, triggerOrderCallAction,
  triggerDocsOutCallAction,
  setDocOutAction,
  clearDocOutAction,
} from './actions';

const getDashboardCounts = dispatch => selectedStager => dispatch(
  triggerDashboardCounts(selectedStager),
);
const getDashboardData = dispatch => payload => dispatch(triggerDashboardDataFetch(payload));
const onCheckBoxClick = dispatch => selectedData => dispatch(
  triggerCheckboxSelect(selectedData),
);
const triggerOrderCall = dispatch => payload => dispatch(triggerOrderCallAction(payload));

const triggerDocsOutCall = dispatch => (payload, action) => {
  dispatch(triggerDocsOutCallAction(payload));
  dispatch(setDocOutAction(action));
};

const onClearDocsOutAction = dispatch => () => dispatch(clearDocOutAction());

const operations = {
  getDashboardCounts,
  getDashboardData,
  onCheckBoxClick,
  triggerOrderCall,
  triggerDocsOutCall,
  onClearDocsOutAction,
};

export default operations;

import {
  triggerDashboardCounts, triggerDashboardDataFetch,
  triggerCheckboxSelect, triggerOrderCallAction,
  triggerDispositionOperationCallAction,
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

const triggerDispositionOperationCall = dispatch => (payload, action) => {
  dispatch(setDocOutAction(action));
  dispatch(triggerDispositionOperationCallAction(payload));
};

const onClearDocsOutAction = dispatch => () => dispatch(clearDocOutAction());

const operations = {
  getDashboardCounts,
  getDashboardData,
  onCheckBoxClick,
  triggerOrderCall,
  triggerDispositionOperationCall,
  onClearDocsOutAction,
};

export default operations;

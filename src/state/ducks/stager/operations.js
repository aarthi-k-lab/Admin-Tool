import {
  triggerDashboardCounts, triggerDashboardDataFetch,
  triggerCheckboxSelect, triggerOrderCallAction,
  triggerDispositionOperationCallAction,
  setDocOutAction,
  setStagerValue,
  setStartEndDate,
  clearDocOutAction,
} from './actions';

const getDashboardCounts = dispatch => () => dispatch(
  triggerDashboardCounts(),
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

const triggerStagerValue = dispatch => payload => dispatch(setStagerValue(payload));

const triggerStartEndDate = dispatch => payload => dispatch(setStartEndDate(payload));

const onClearDocsOutAction = dispatch => () => dispatch(clearDocOutAction());

const operations = {
  getDashboardCounts,
  getDashboardData,
  onCheckBoxClick,
  triggerOrderCall,
  triggerDispositionOperationCall,
  onClearDocsOutAction,
  triggerStagerValue,
  triggerStartEndDate,
};

export default operations;

import {
  triggerDashboardCounts, triggerDashboardDataFetch,
  triggerCheckboxSelect, triggerOrderCallAction,
  triggerDispositionOperationCallAction,
  triggerDownloadDataFetch,
  setDocOutAction,
  setStagerValue,
  setStartEndDate,
  clearDocOutAction,
  setPageCount,
} from './actions';

const getDashboardCounts = dispatch => () => dispatch(
  triggerDashboardCounts(),
);
const getDashboardData = dispatch => payload => dispatch(triggerDashboardDataFetch(payload));
const onDownloadData = dispatch => payload => dispatch(triggerDownloadDataFetch(payload));
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

const onClearDocGenAction = dispatch => () => dispatch(clearDocOutAction());
const triggerStagerPageCount = dispatch => payload => dispatch(setPageCount(payload));

const operations = {
  getDashboardCounts,
  getDashboardData,
  onCheckBoxClick,
  onDownloadData,
  triggerOrderCall,
  triggerDispositionOperationCall,
  onClearDocGenAction,
  triggerStagerValue,
  triggerStartEndDate,
  triggerStagerPageCount,
};

export default operations;

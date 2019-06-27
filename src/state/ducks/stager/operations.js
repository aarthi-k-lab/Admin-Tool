import {
    triggerDashboardCounts,
    triggerDashboardDataFetch,
    triggerCheckboxSelect,
    triggerOrderCallAction,
    triggerDispositionOperationCallAction,
    triggerDownloadDataFetch,
    setDocGenAction,
    setStagerValue,
    setStartEndDate,
    clearDocGenAction,
    setStagerGroup,
} from './actions';

const getDashboardCounts = dispatch => () => dispatch(
    triggerDashboardCounts(),
);
const getDashboardData = dispatch => payload => dispatch(triggerDashboardDataFetch(payload));
const onDownloadData = dispatch => payload => dispatch(triggerDownloadDataFetch(payload));
const onCheckBoxClick = dispatch => selectedData => dispatch(
    triggerCheckboxSelect(selectedData),
);

const triggerOrderCall = dispatch => (payload, endPoint) => dispatch(
    triggerOrderCallAction(payload, endPoint),
);

const triggerDispositionOperationCall = dispatch => (payload, action) => {
    dispatch(setDocGenAction(action));
    dispatch(triggerDispositionOperationCallAction(payload));
};

const triggerStagerValue = dispatch => payload => dispatch(setStagerValue(payload));

const triggerStartEndDate = dispatch => payload => dispatch(setStartEndDate(payload));

const onClearDocGenAction = dispatch => () => dispatch(clearDocGenAction());
const triggerStagerGroup = dispatch => payload => dispatch(setStagerGroup(payload));


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
    triggerStagerGroup,
};

export default operations;
import * as R from 'ramda';

const getCounts = state => state.stager.counts;
const getLoaderInfo = state => state.stager.loading;
const getdocGenResponse = state => (state.stager.docGenResponse
  ? state.stager.docGenResponse : []);
const getTableData = state => (state.stager.data ? state.stager.data : []);
const getTaskName = state => (state.stager.data ? state.stager.data.stagerTaskType : '');
const getSelectedData = state => (state.stager.selectedData ? state.stager.selectedData : []);
const getActiveSearchTerm = state => (state.stager && state.stager.activeSearchTerm);
const getdocGenAction = state => (state.stager && state.stager.docGenAction);
const getStagerValue = state => (state.stager && state.stager.stagerValue);
const getStagerStartEndDate = state => (state.stager && state.stager.stagerStartEndDate);
const getDownloadData = state => (state.stager && state.stager.csvData);
const getStagerGroup = state => (state.stager && state.stager.stagerGroup);
const getStagerSearchResponse = state => (state.stager && state.stager.searchStagerLoanResponse);
const getSearchStagerLoanNumber = state => (state.stager && state.stager.searchStagerLoanNumber);


const getAzureSearchToggle = state => R.pathOr(false, ['stager', 'azureSearchToggle'], state);
const getDelayCheckList = state => R.path(['stager', 'delayCheckList'], state);
const getDelayCheckListHistory = state => R.pathOr([], ['stager', 'delayCheckListHistory'], state);
const showRefreshButton = state => R.contains(R.pathOr(null, ['stager', 'data', 'stagerTaskStatus'], state), ['To Order', 'Ordered']);
const getStagerTaskType = state => R.pathOr(null, ['stager', 'data', 'stagerTaskType'], state);

const selectors = {
  getAzureSearchToggle,
  getCounts,
  getLoaderInfo,
  getTableData,
  getSelectedData,
  getActiveSearchTerm,
  getDownloadData,
  getdocGenResponse,
  getdocGenAction,
  getStagerValue,
  getStagerStartEndDate,
  getStagerGroup,
  getStagerSearchResponse,
  getSearchStagerLoanNumber,
  getTaskName,
  getDelayCheckList,
  getDelayCheckListHistory,
  showRefreshButton,
  getStagerTaskType,
};

export default selectors;

const getCounts = state => state.stager.counts;
const getLoaderInfo = state => state.stager.loading;
const getdocGenResponse = state => (state.stager.docGenResponse
  ? state.stager.docGenResponse : []);
const getTableData = state => (state.stager.data ? state.stager.data : []);
const getSelectedData = state => (state.stager.selectedData ? state.stager.selectedData : []);
const getActiveSearchTerm = state => (state.stager && state.stager.activeSearchTerm);
const getdocGenAction = state => (state.stager && state.stager.docGenAction);
const getStagerValue = state => (state.stager && state.stager.stagerValue);
const getStagerStartEndDate = state => (state.stager && state.stager.stagerStartEndDate);
const getDownloadData = state => (state.stager && state.stager.csvData);
const getStagerGroup = state => (state.stager && state.stager.stagerGroup);
const getStagerSearchResponse = state => (state.stager && state.stager.searchStagerLoanResponse);

const selectors = {
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
};

export default selectors;

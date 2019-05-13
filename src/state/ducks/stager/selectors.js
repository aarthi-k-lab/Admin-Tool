const getCounts = state => state.stager.counts;
const getLoaderInfo = state => state.stager.loading;
const getDocsOutResponse = state => (state.stager.docsOutResponse
  ? state.stager.docsOutResponse : []);
const getTableData = state => (state.stager.data ? state.stager.data : []);
const getSelectedData = state => (state.stager.selectedData ? state.stager.selectedData : []);
const getActiveSearchTerm = state => (state.stager && state.stager.activeSearchTerm);
const getDownloadCSVUri = state => (state.stager && state.stager.downloadCSVUri);

const selectors = {
  getCounts,
  getLoaderInfo,
  getTableData,
  getSelectedData,
  getActiveSearchTerm,
  getDownloadCSVUri,
  getDocsOutResponse,
};

export default selectors;

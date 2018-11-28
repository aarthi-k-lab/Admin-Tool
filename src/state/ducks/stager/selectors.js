const getCounts = state => state.stager.counts;
const getLoaderInfo = state => state.stager.loading;
const getTableData = state => (state.stager.data ? state.stager.data : []);
const getSelectedData = state => (state.stager.selectedData ? state.stager.selectedData : []);

const selectors = {
  getCounts,
  getLoaderInfo,
  getTableData,
  getSelectedData,
};

export default selectors;

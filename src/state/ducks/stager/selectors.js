const getCounts = state => state.stager.counts;
const getLoaderInfo = state => state.stager.loading;

const selectors = {
  getCounts,
  getLoaderInfo,
};

export default selectors;

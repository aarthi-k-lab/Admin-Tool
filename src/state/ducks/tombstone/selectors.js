const isLoading = state => state.tombstone.loading;
const hasError = state => state.tombstone.error;
const getTombstoneData = state => state.tombstone.data;

const selectors = {
  getTombstoneData,
  hasError,
  isLoading,
};

export default selectors;

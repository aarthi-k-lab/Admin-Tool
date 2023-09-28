import * as R from 'ramda';

const getIndexerGridData = state => R.pathOr({}, ['indexer', 'indexerGridData'], state);

const selectors = {
  getIndexerGridData,
};

export default selectors;

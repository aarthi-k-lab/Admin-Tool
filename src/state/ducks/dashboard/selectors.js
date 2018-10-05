import * as R from 'ramda';

const expandView = state => R.propOr(false, 'expandView', state.dashboard);

const enableGetNext = state => R.pathOr(false, ['dashboard', 'getNextResponse', 'enableGetNext'], state);

const getDiscrepancies = state => R.pathOr({}, ['dashboard', 'getNextResponse', 'discrepancies'], state);

const selectors = {
  enableGetNext,
  expandView,
  getDiscrepancies,
};

export default selectors;

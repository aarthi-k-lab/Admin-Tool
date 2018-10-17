import * as R from 'ramda';

const expandView = state => R.propOr(false, 'expandView', state.dashboard);

const isFirstVisit = state => R.pathOr(false, ['dashboard', 'firstVisit'], state);

const loanNumber = state => R.pathOr(false, ['dashboard', 'loanNumber'], state);

const evalId = state => R.pathOr(false, ['dashboard', 'evalId'], state);

const getDisposition = state => R.pathOr('', ['dashboard', 'selectedDisposition'], state);

const enableGetNext = state => (
  isFirstVisit(state)
  || R.pathOr(false, ['dashboard', 'getNextResponse', 'enableGetNext'], state)
);

const getDiscrepancies = state => R.pathOr({}, ['dashboard', 'getNextResponse', 'discrepancies'], state);

const selectors = {
  enableGetNext,
  evalId,
  expandView,
  getDiscrepancies,
  getDisposition,
  isFirstVisit,
  loanNumber,
};

export default selectors;

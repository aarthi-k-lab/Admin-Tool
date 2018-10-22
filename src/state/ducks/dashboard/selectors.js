import * as R from 'ramda';

const expandView = state => R.propOr(false, 'expandView', state.dashboard);

const isFirstVisit = state => R.pathOr(false, ['dashboard', 'firstVisit'], state);

const noTasksFound = state => R.pathOr(false, ['dashboard', 'noTasksFound'], state);

const loanNumber = state => R.pathOr(null, ['dashboard', 'loanNumber'], state);

const evalId = state => R.pathOr(null, ['dashboard', 'evalId'], state);

const taskId = state => R.pathOr(null, ['dashboard', 'taskId'], state);


const getDisposition = state => R.pathOr('', ['dashboard', 'selectedDisposition'], state);

const enableGetNext = state => (
  isFirstVisit(state)
  || R.pathOr(false, ['dashboard', 'getNextResponse', 'enableGetNext'], state)
);

// enableEndShift has same conditions as getnext to get enabled
const enableEndShift = state => (
  isFirstVisit(state)
  || R.pathOr(false, ['dashboard', 'getNextResponse', 'enableGetNext'], state)
);

const getDiscrepancies = state => R.pathOr({}, ['dashboard', 'getNextResponse', 'discrepancies'], state);

const selectors = {
  enableEndShift,
  enableGetNext,
  evalId,
  noTasksFound,
  taskId,
  expandView,
  getDiscrepancies,
  getDisposition,
  isFirstVisit,
  loanNumber,
};

export default selectors;

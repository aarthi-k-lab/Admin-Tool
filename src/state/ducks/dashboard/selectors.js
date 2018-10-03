import * as R from 'ramda';

const expandView = state => R.propOr(false, 'expandView', state.dashboard);

const selectors = {
  expandView,
};

export default selectors;

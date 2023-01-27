import * as R from 'ramda';

const isLoading = state => state.tombstone.loading;
const hasError = state => state.tombstone.error;
const getTombstoneData = state => state.tombstone.data;

const getRFDTableData = state => R.pathOr([], ['tombstone', 'rfdTableData'], state);

const isRFDAvailable = state => !R.isEmpty(getRFDTableData(state));

const getReasonDescriptionOptions = state => R.pathOr([], ['tombstone', 'reasonDescriptionOptions'], state);

const getViewType = state => R.pathOr('', ['tombstone', 'selectedView'], state);

const getLoader = state => R.pathOr(false, ['tombstone', 'loader'], state);

const getChecklistCenterPaneView = state => R.pathOr('', ['tombstone', 'checklistCenterPaneView'], state);

const getPrimaryUseDropdown = state => R.pathOr([], ['tombstone', 'primaryUse'], state);

const getCollateralData = state => R.pathOr([], ['tombstone', 'collateralData'], state);

const getLienLoanBalance = state => R.pathOr([], ['tombstone', 'lienLoanBalance'], state);

const getPropertyValuations = state => R.pathOr([], ['tombstone', 'propertyValuations'], state);

const selectors = {
  getTombstoneData,
  hasError,
  isLoading,
  isRFDAvailable,
  getRFDTableData,
  getReasonDescriptionOptions,
  getLoader,
  getChecklistCenterPaneView,
  getViewType,
  getPrimaryUseDropdown,
  getCollateralData,
  getLienLoanBalance,
  getPropertyValuations,
};

export default selectors;

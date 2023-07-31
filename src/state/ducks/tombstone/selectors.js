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

const getTombstoneModViewData = state => R.pathOr([], ['tombstone', 'viewTypeData', 'modViewData'], state);

const getReasonableEffortData = state => R.pathOr({}, ['tombstone', 'reasonableEffortData'], state);

const getCFPBTableData = state => R.pathOr([], ['tombstone', 'cfpbTableData'], state);

const getReasonableEffortId = (state) => {
  const data = R.pathOr([], ['tombstone', 'data'], state);
  return R.propOr('', 'content', R.find(R.propEq('title',
    'Reasonable Effort'))(data));
};

const getTombstoneLoanViewData = state => R.pathOr([], ['tombstone', 'viewTypeData', 'loanViewData'], state);

const getHardshipData = state => R.pathOr([], ['tombstone', 'hardshipData'], state);

const getUpdatedHardshipData = state => R.pathOr([], ['tombstone', 'updatedBorrowerHardshipData'], state);

const getHardshipSourceDropDownData = state => R.pathOr([], ['tombstone', 'sourceDropDownValues'], state);

const getHardshipTypeDropDownData = state => R.pathOr([], ['tombstone', 'typeDropDownValues'], state);

const getHardshipEthnicityDropDownData = state => R.pathOr([], ['tombstone', 'ethnicityDropDownValues'], state);

const getHardshipRaceDropDownData = state => R.pathOr([], ['tombstone', 'raceDropDownValues'], state);

const getHardshipSexDropDownData = state => R.pathOr([], ['tombstone', 'sexDropDownValues'], state);

const getHardshipBeginDate = state => R.pathOr('', ['tombstone', 'hardshipBeginDate'], state);

const getHardshipEndDate = state => R.pathOr('', ['tombstone', 'hardshipEndDate'], state);

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
  getTombstoneModViewData,
  getReasonableEffortData,
  getCFPBTableData,
  getReasonableEffortId,
  getTombstoneLoanViewData,
  getHardshipData,
  getUpdatedHardshipData,
  getHardshipSourceDropDownData,
  getHardshipTypeDropDownData,
  getHardshipEthnicityDropDownData,
  getHardshipRaceDropDownData,
  getHardshipSexDropDownData,
  getHardshipBeginDate,
  getHardshipEndDate,
};

export default selectors;

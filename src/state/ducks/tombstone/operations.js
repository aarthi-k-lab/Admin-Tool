
import {
  HARDSHIP_SOURCE, HARDSHIP_TYPE, SEX, ETHNICITY, RACE,
} from 'constants/fhlmc';
import {
  clearHardshipDataAction,
  clearUpdatedHardshipDataAction,
  getRFDTableData,
  getRFDReasonDescDropdown,
  onSubmitToRFDRequest,
  clearTombstoneData,
  checklistCenterPaneData,
  toggleViewTypeAction,
  populateCollateralDropdownAction,
  fetchCollateralDataAction,
  addLoanBalanceAction,
  saveCollateralDataAction,
  refreshLienBalanceAction,
  getReasonableEffortDataAction,
  getReasonableEffortHistoryData,
  getReasonableEffortById,
  getCFPBTableData,
  fetchHardshipDataAction,
  saveHardshipDataAction,
  updateHardsipDataAction,
  setUpdatedBorrowerHardshipInfoAction,
  populateHardshipDropdownAction,
} from './actions';

const getRFDTableDataOperation = dispatch => (loanNumber) => {
  dispatch(getRFDTableData(loanNumber));
};

const getRFDReasonDescDropdownOperation = dispatch => () => {
  dispatch(getRFDReasonDescDropdown());
};

const onSubmitToRFDRequestOperation = dispatch => (payload) => {
  dispatch(onSubmitToRFDRequest(payload));
};

const clearTombstoneDataOperation = dispatch => () => {
  dispatch(clearTombstoneData());
};
const setChecklistCenterPaneDataOperation = dispatch => (payload) => {
  dispatch(checklistCenterPaneData(payload));
};

const toggleViewType = dispatch => () => {
  dispatch(toggleViewTypeAction());
};

const populateCollateralEventsOperation = dispatch => (payload) => {
  dispatch(populateCollateralDropdownAction(payload));
};

const fetchCollateralDataOperation = dispatch => (payload) => {
  dispatch(fetchCollateralDataAction(payload));
};

const refreshLienBalanceOperation = dispatch => (payload) => {
  dispatch(refreshLienBalanceAction(payload));
};

const addLoanBalanceOperation = dispatch => (payload) => {
  dispatch(addLoanBalanceAction(payload));
};

const saveCollateralDataOperation = dispatch => (payload) => {
  dispatch(saveCollateralDataAction(payload));
};

const getReasonableEffortDataOperation = dispatch => () => {
  dispatch(getReasonableEffortDataAction());
};

const getReasonableEffortHistoryDataOperation = dispatch => () => {
  dispatch(getReasonableEffortHistoryData());
};

const getReasonableEffortByIdOperation = dispatch => (payload) => {
  dispatch(getReasonableEffortById(payload));
};

const getCFPBTableDataOperation = dispatch => (loanNumber) => {
  dispatch(getCFPBTableData(loanNumber));
};
const fetchHardshipDataOperation = dispatch => (payload) => {
  dispatch(fetchHardshipDataAction(payload));
};

const updateHardshipDataOperation = dispatch => (payload) => {
  dispatch(updateHardsipDataAction(payload));
};

const setUpdateBorrwerHardshipDataOperation = dispatch => (payload) => {
  dispatch(setUpdatedBorrowerHardshipInfoAction(payload));
};

const clearHardshipDataOperation = dispatch => () => {
  dispatch(clearHardshipDataAction());
};

const clearUpdatedHardshipDataOperation = dispatch => () => {
  dispatch(clearUpdatedHardshipDataAction());
};

const saveHardshipDataOperation = dispatch => (payload) => {
  dispatch(saveHardshipDataAction(payload));
};

const populateHardshipDropdownOperation = dispatch => () => {
  dispatch(populateHardshipDropdownAction({ type: HARDSHIP_SOURCE }));
  dispatch(populateHardshipDropdownAction({ type: HARDSHIP_TYPE }));
  dispatch(populateHardshipDropdownAction({ type: SEX }));
  dispatch(populateHardshipDropdownAction({ type: ETHNICITY }));
  dispatch(populateHardshipDropdownAction({ type: RACE }));
};

export default {
  clearHardshipDataOperation,
  clearUpdatedHardshipDataOperation,
  getRFDTableDataOperation,
  getRFDReasonDescDropdownOperation,
  onSubmitToRFDRequestOperation,
  populateCollateralEventsOperation,
  fetchCollateralDataOperation,
  clearTombstoneDataOperation,
  setChecklistCenterPaneDataOperation,
  toggleViewType,
  addLoanBalanceOperation,
  saveCollateralDataOperation,
  refreshLienBalanceOperation,
  getReasonableEffortDataOperation,
  getReasonableEffortHistoryDataOperation,
  getReasonableEffortByIdOperation,
  getCFPBTableDataOperation,
  saveHardshipDataOperation,
  fetchHardshipDataOperation,
  updateHardshipDataOperation,
  setUpdateBorrwerHardshipDataOperation,
  populateHardshipDropdownOperation,
};

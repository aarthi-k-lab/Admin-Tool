
import {
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

export default {
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
};

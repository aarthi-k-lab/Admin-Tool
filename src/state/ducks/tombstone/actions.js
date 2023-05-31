import {
  FETCH_TOMBSTONE_DATA,
  GET_RFDTABLE_DATA,
  GET_RFD_DROPDOWN_DATA,
  SAVE_RFD_REQUEST,
  CLEAR_TOMBSTONE_DATA,
  SET_CHECKLIST_CENTERPANE,
  TOGGLE_VIEW,
  POPULATE_COLLATERAL_DROPDOWN,
  FETCH_COLLATERAL_DATA,
  ADD_LIEN_LOAN_BALANCE,
  SAVE_COLLATERAL_DATA,
  REFRESH_LIEN_BALANCES,
  GET_REASONABLE_EFFORT_DATA,
  GET_REASONABLE_EFFORT_HISTORY_DATA,
  GET_REASONABLE_EFFORT_DATA_BY_ID,
  GET_CFPBTABLE_DATA,
} from './types';

const fetchTombstoneData = (loanNumber, taskName, taskId) => ({
  type: FETCH_TOMBSTONE_DATA,
  payload: {
    loanNumber,
    taskName,
    taskId,
  },
});
const getRFDTableData = loanNumber => ({
  type: GET_RFDTABLE_DATA,
  payload: loanNumber,
});

const getRFDReasonDescDropdown = () => ({
  type: GET_RFD_DROPDOWN_DATA,
});

const onSubmitToRFDRequest = payload => ({
  type: SAVE_RFD_REQUEST,
  payload,
});

const clearTombstoneData = () => ({
  type: CLEAR_TOMBSTONE_DATA,
});

const checklistCenterPaneData = payload => ({
  type: SET_CHECKLIST_CENTERPANE,
  payload,
});

const toggleViewTypeAction = () => ({
  type: TOGGLE_VIEW,
});

const populateCollateralDropdownAction = payload => ({
  type: POPULATE_COLLATERAL_DROPDOWN,
  payload,
});

const fetchCollateralDataAction = payload => ({
  type: FETCH_COLLATERAL_DATA,
  payload,
});

const addLoanBalanceAction = payload => ({
  type: ADD_LIEN_LOAN_BALANCE,
  payload,
});

const saveCollateralDataAction = payload => ({
  type: SAVE_COLLATERAL_DATA,
  payload,
});

const refreshLienBalanceAction = payload => ({
  type: REFRESH_LIEN_BALANCES,
  payload,
});

const getReasonableEffortDataAction = () => ({
  type: GET_REASONABLE_EFFORT_DATA,
});


const getReasonableEffortHistoryData = () => ({
  type: GET_REASONABLE_EFFORT_HISTORY_DATA,
});

const getReasonableEffortById = payload => ({
  type: GET_REASONABLE_EFFORT_DATA_BY_ID,
  payload,
});

const getCFPBTableData = loanNumber => ({
  type: GET_CFPBTABLE_DATA,
  payload: loanNumber,
});

export {
  fetchTombstoneData,
  getRFDTableData,
  getRFDReasonDescDropdown,
  onSubmitToRFDRequest,
  populateCollateralDropdownAction,
  clearTombstoneData,
  checklistCenterPaneData,
  toggleViewTypeAction,
  fetchCollateralDataAction,
  addLoanBalanceAction,
  saveCollateralDataAction,
  refreshLienBalanceAction,
  getReasonableEffortDataAction,
  getReasonableEffortHistoryData,
  getReasonableEffortById,
  getCFPBTableData,
};

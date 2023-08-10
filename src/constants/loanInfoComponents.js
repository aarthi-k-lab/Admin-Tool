const CHECKLIST = 'Checklist';
const RFD = 'Reason for Default';
const COLLATERAL = 'Occupancy Type';
const EDITABLE_FIELDS = ['Reason for Default', 'Occupancy Type', 'Reasonable effort', 'Hardship'];
const RFD_ERROR = "Couldn't fetch RFD Data.Service down";
const COLLATERAL_ERROR = "Couldn't fetch Collateral data. Service down";
const COLLATERAL_SUCCESS_MSG = 'Successfully saved in TKAMS';
const NO_DATA = 'No data available';
const EXCEPTION = 'Exception while saving Request';
const LOAN_LIEN_ERROR = "Couldn't add loan balance. Please try after sometime";
const SAVE_ERROR = 'Error while saving Data.Please try after sometime';
const RFD_DIALOG_MSG = 'Are you sure you want to discard the unsaved changes?';
const RFD_TITLE = 'Reason for Default (RFD)';
const RFD_SAVE_INFO = 'Clicking on the Save Button will Add the RFD information to the Reason(s) History';
const DOC_CHECKLIST_FETCH_ERROR = "Couldn't fetch Doc Checklist Data. Service down";
const DOC_CHECKLIST_SAVE_ERROR = 'Error while saving Data.Please try after sometime';
const REASONABLE_EFFECT = 'Reasonable effort';
const DOC_HIST_ERROR = "Couldn't fetch Document History";
const FILENET_TYPES_ERROR = "Couldn't fetch Filenet Categories and Types data. Service down";
const REASONABLE_EFFORT_FETCH_ERROR = "Couldn't fetch Reasonable effort data";
const REASONABLE_EFFORT_HISTORY_FETCH_ERROR = "Couldn't fetch Reasonable effort history data";
const DOC_UNLINK_ERROR = " Couldn't unlink the document";
const DEFECT_REASON_ERROR = "Couldn't fetch Defect Reason data. Service down";
const DOC_REVIEW_STATUS_ERROR = "Couldn't fetch Doc Review Status data. Service down";
const HARDHSIP = 'Hardship';
const HARDSHIP_AFFIDAVIT_TITLE = 'Hardship Affidavit';
const HARDSHIP_DIALOG_MSG = 'Are you sure you want to discard the unsaved changes?';
const DECEASED_BORROWER = 'ESTATE OF';
const HARDSHIP_SUCCES_MSG = 'Hardship details saved successfully.';
const FETCH_ERROR = 'Error while fetching Data.Please try after sometime';
const VALIDATE_WESTWING_ERROR = 'Error while fetching data from tkams to validate west wing widget. Please try after sometime';

module.exports = {
  CHECKLIST,
  RFD,
  EDITABLE_FIELDS,
  RFD_ERROR,
  COLLATERAL_ERROR,
  COLLATERAL_SUCCESS_MSG,
  NO_DATA,
  EXCEPTION,
  LOAN_LIEN_ERROR,
  SAVE_ERROR,
  RFD_DIALOG_MSG,
  RFD_TITLE,
  RFD_SAVE_INFO,
  DOC_CHECKLIST_FETCH_ERROR,
  DOC_CHECKLIST_SAVE_ERROR,
  DEFECT_REASON_ERROR,
  COLLATERAL,
  REASONABLE_EFFECT,
  DOC_HIST_ERROR,
  FILENET_TYPES_ERROR,
  REASONABLE_EFFORT_HISTORY_FETCH_ERROR,
  REASONABLE_EFFORT_FETCH_ERROR,
  DOC_UNLINK_ERROR,
  DOC_REVIEW_STATUS_ERROR,
  HARDHSIP,
  HARDSHIP_AFFIDAVIT_TITLE,
  HARDSHIP_DIALOG_MSG,
  DECEASED_BORROWER,
  HARDSHIP_SUCCES_MSG,
  FETCH_ERROR,
  VALIDATE_WESTWING_ERROR,
};

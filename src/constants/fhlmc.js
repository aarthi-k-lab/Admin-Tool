const ELIGIBLE = 'Previous Freddie call was eligible';
const INELIGIBLE = 'Previous Freddie call was ineligible';
const NOCALL = 'Not yet submitted';
const ID_CATEGORIES = ['Case id(s)', 'Loan Number(s)'];
const FHLMC = 'FHLMC';
const APPROVAL_TYPE = 'FHLMCApprovalType';
const PRE_APPROVAL_TYPE = 'FHLMCPreApproved';
const APPROVAL_REQUEST_TYPE = 'FHLMCPreApprovedRequestType';
const LOAN_NUMBERS_IDTYPE = 'Loan Number(s)';
const PREAPPROVED_DISASTER_TYPES = ['Disaster', 'Pandemic'];
const STANDARD = 'Standard';

const REGEX_FHLMC_PREAPPROVED_DISASTER = /[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\"<>?]|^[,]|^[:]/;
const REGEX_FHLMC_COMMON = /[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]|^[,]/;
const REQUEST_TYPE_REQ = 'Please select request type and upload excel file';
const FILE_UPLOAD_REQ = 'Kindly upload an excel File';
const CANCELLATION_REASON = 'Please select Cancellation Reason and Submit';
const REQ_PRCS = 'We are processing your request.  Please do not close the browser.';

const GENERATE_BOARDING_TEMPLATE_STATUS = 'Request will be processed in the backend. Proceed with other Loans';
const VALIDATION_FAILURE_MSG = 'One or more entries are not valid. Please check and try again';

module.exports = {
  ELIGIBLE,
  INELIGIBLE,
  NOCALL,
  ID_CATEGORIES,
  FHLMC,
  APPROVAL_TYPE,
  PRE_APPROVAL_TYPE,
  APPROVAL_REQUEST_TYPE,
  REGEX_FHLMC_PREAPPROVED_DISASTER,
  REGEX_FHLMC_COMMON,
  LOAN_NUMBERS_IDTYPE,
  PREAPPROVED_DISASTER_TYPES,
  REQUEST_TYPE_REQ,
  FILE_UPLOAD_REQ,
  CANCELLATION_REASON,
  REQ_PRCS,
  GENERATE_BOARDING_TEMPLATE_STATUS,
  VALIDATION_FAILURE_MSG,
  STANDARD,
};

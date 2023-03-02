// /* eslint-disable import/prefer-default-export */
import {
  radioSelectAction, setMockDataAction, linkDocuments, borrowerNames, unLinkDocuments,
  setTag, docReviewStatusDropdown,
  fetchFileNetData,
  setFilterStartDate, setFilterEndDate, setFilterDocCategory, setUploadedFiles,
  changeDocDetails, fetchDocChecklistData,
  docValidation, defectReasonDropdown, setSelectedBorrower,
} from './actions';

const fetchFileNetDataOperation = dispatch => () => dispatch(fetchFileNetData());
const radioSelectOperation = dispatch => payload => dispatch(radioSelectAction(payload));
const setMockDataOpeartion = dispatch => payload => dispatch(setMockDataAction(payload));
const linkDocumentsOperation = dispatch => payload => dispatch(linkDocuments(payload));
const borrowerNameOperation = dispatch => payload => dispatch(borrowerNames(payload));
const unlinkDocumentOperation = dispatch => payload => dispatch(unLinkDocuments(payload));
const setTagOperation = dispatch => payload => dispatch(setTag(payload));
const docReviewStatusDropdownOperation = dispatch => (payload) => {
  dispatch(docReviewStatusDropdown(payload));
};
const setFilterStartDateOperation = dispatch => payload => dispatch(setFilterStartDate(payload));
const setFilterEndDateOperation = dispatch => payload => dispatch(setFilterEndDate(payload));
const setFilterDocCategoryOperation = dispatch => (payload) => {
  dispatch(setFilterDocCategory(payload));
};
const setUploadedFilesOperation = dispatch => (payload) => {
  dispatch(setUploadedFiles(payload));
};

const changeDocumentDetails = dispatch => (payload) => {
  dispatch(changeDocDetails(payload));
};

const setDocChecklistDataOperation = dispatch => () => {
  dispatch(fetchDocChecklistData());
};

const onDocValidation = dispatch => (groupName) => {
  if (groupName === 'PROC') { dispatch(docValidation()); }
};

const defectReasonDropdownOperation = dispatch => (payload) => {
  dispatch(defectReasonDropdown(payload));
};

const setSelectedBorrowerOperation = dispatch => (payload) => {
  dispatch(setSelectedBorrower(payload));
};

export default {
  fetchFileNetDataOperation,
  radioSelectOperation,
  setMockDataOpeartion,
  linkDocumentsOperation,
  borrowerNameOperation,
  unlinkDocumentOperation,
  setTagOperation,
  docReviewStatusDropdownOperation,
  setFilterStartDateOperation,
  setFilterEndDateOperation,
  setFilterDocCategoryOperation,
  setUploadedFilesOperation,
  changeDocumentDetails,
  setDocChecklistDataOperation,
  onDocValidation,
  defectReasonDropdownOperation,
  setSelectedBorrowerOperation,
};

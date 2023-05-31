/* eslint-disable import/prefer-default-export */
import {
  RADIO_SELECT,
  FETCH_DOCUMENT_DATA,
  LINK_DOCUMENTS_SAGA,
  BORRORWERS_NAMES_SAGA,
  UNLINK_DOCUMENTS_SAGA,
  SET_TAG_SAGA,
  DOC_REVIEW_STATUS_DROPDOWN,
  FETCH_FILENET_DATA,
  SET_FILTER_START_DATE,
  SET_FILTER_END_DATE,
  SET_FILTER_DOC_CAT,
  UPLOADED_FILES,
  DOCUMENT_DETAILS_CHANGE,
  FETCH_DOC_TXNS, DOC_CHECKLIST_DATA,
  TRIGGER_DOC_VALIDATION,
  DEFECT_REASON_DROPDOWN,
  SET_SELECTED_BORROWER,
  FETCH_DOC_HISTORY,
  RESET_DOC_CHK_DATA,
  RESET_FILENET_DOC_TYPES,
  FETCH_FILENET_CAT_TYPES,
  FETCH_FILENET_TYPES,
  DOC_CHECKLIST_ADD_CONTRIBUTOR,
} from './types';

const fetchFileNetData = payload => ({
  type: FETCH_FILENET_DATA,
  payload,
});

const radioSelectAction = payload => ({
  type: RADIO_SELECT,
  payload,
});

const setMockDataAction = payload => ({
  type: FETCH_DOCUMENT_DATA,
  payload,
});

const linkDocuments = payload => ({
  type: LINK_DOCUMENTS_SAGA,
  payload,
});

const borrowerNames = payload => ({
  type: BORRORWERS_NAMES_SAGA,
  payload,
});

const unLinkDocuments = payload => ({
  type: UNLINK_DOCUMENTS_SAGA,
  payload,
});

const setTag = payload => ({
  type: SET_TAG_SAGA,
  payload,
});

const docReviewStatusDropdown = payload => ({
  type: DOC_REVIEW_STATUS_DROPDOWN,
  payload,
});

const setFilterStartDate = payload => ({
  type: SET_FILTER_START_DATE,
  payload,
});

const setFilterEndDate = payload => ({
  type: SET_FILTER_END_DATE,
  payload,
});

const setFilterDocCategory = payload => ({
  type: SET_FILTER_DOC_CAT,
  payload,
});

const setUploadedFiles = payload => ({
  type: UPLOADED_FILES,
  payload,
});

const changeDocDetails = payload => ({
  type: DOCUMENT_DETAILS_CHANGE,
  payload,
});

const fetchDocChecklistData = payload => ({
  type: FETCH_DOC_TXNS,
  payload,
});

const setDocChecklistData = payload => ({
  type: DOC_CHECKLIST_DATA,
  payload,
});

const docValidation = () => ({
  type: TRIGGER_DOC_VALIDATION,
});

const defectReasonDropdown = payload => ({
  type: DEFECT_REASON_DROPDOWN,
  payload,
});

const setSelectedBorrower = payload => ({
  type: SET_SELECTED_BORROWER,
  payload,
});

const fetchDocHistory = payload => ({
  type: FETCH_DOC_HISTORY, payload,
});

const resetDocChecklistData = () => ({
  type: RESET_DOC_CHK_DATA,
});

const resetFileNetDocTypes = () => ({
  type: RESET_FILENET_DOC_TYPES,
});

const fetchFilenetCatTypes = () => ({
  type: FETCH_FILENET_CAT_TYPES,
});

const fetchFilenetTypes = payload => ({
  type: FETCH_FILENET_TYPES, payload,
});

const addContributor = payload => ({
  type: DOC_CHECKLIST_ADD_CONTRIBUTOR, payload,
});

export {
  radioSelectAction, setMockDataAction, linkDocuments, borrowerNames, unLinkDocuments, setTag,
  docReviewStatusDropdown,
  fetchFileNetData, setFilterStartDate, setFilterEndDate, setFilterDocCategory, setUploadedFiles,
  changeDocDetails, fetchDocChecklistData, setDocChecklistData,
  docValidation, defectReasonDropdown, setSelectedBorrower, fetchDocHistory, resetDocChecklistData,
  resetFileNetDocTypes, fetchFilenetCatTypes, fetchFilenetTypes, addContributor,
};

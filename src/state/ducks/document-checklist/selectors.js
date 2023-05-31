/* eslint-disable import/prefer-default-export */
import * as R from 'ramda';

const getRadioSelect = state => R.pathOr('', ['documentChecklist', 'radioSelect'], state);
const getMockData = state => R.pathOr([], ['documentChecklist', 'docChecklistData'], state);
const getDocuments = state => R.pathOr([], ['documentChecklist', 'documents'], state);

const getSelectedBorrower = state => R.pathOr('', ['documentChecklist', 'selectedBorrower'], state);

const getBorrowers = state => R.pathOr({}, ['documentChecklist', 'borrowerNames'], state);
const getDocReviewStatusDropdown = state => R.pathOr([], ['documentChecklist', 'docReviewStatusData'], state);
const getFilterStartDate = state => R.pathOr(null, ['documentChecklist', 'filterStartDate'], state);
const getFilterEndDate = state => R.pathOr(null, ['documentChecklist', 'filterEndDate'], state);
const getFilterDocCategory = state => R.pathOr('', ['documentChecklist', 'filterDocCategory'], state);
const getFilenetDocCategory = state => R.pathOr([], ['documentChecklist', 'filenetDocCategory'], state);
const getUploadedFiles = state => R.pathOr([], ['documentChecklist', 'uploadedFiles'], state);
const getFilenetDocType = state => R.pathOr([], ['documentChecklist', 'filenetDocType'], state);
const getDocChecklistData = state => R.pathOr([], ['documentChecklist', 'docChecklistData'], state);
const getErrorFields = state => R.pathOr({}, ['documentChecklist', 'errorFields'], state);
const getDefectReasonDropdown = state => R.pathOr({}, ['documentChecklist', 'defectReasonData'], state);
const getDocHistory = state => R.pathOr([], ['documentChecklist', 'docHistory'], state);
const getIsLinkingSuccess = state => R.pathOr(false, ['documentChecklist', 'isLinkingDoc'], state);
const getInitialDocChecklistData = state => R.pathOr([], ['documentChecklist', 'initialDocChecklistData'], state);
const getFilenetCatTypes = state => R.pathOr([], ['documentChecklist', 'filenetCatTypes'], state);
const getLoader = state => R.pathOr(true, ['documentChecklist', 'loader'], state);
const selectors = {
  getRadioSelect,
  getMockData,
  getBorrowers,
  getDocuments,
  getSelectedBorrower,
  getDocReviewStatusDropdown,
  getFilterStartDate,
  getFilterEndDate,
  getFilterDocCategory,
  getFilenetDocCategory,
  getUploadedFiles,
  getFilenetDocType,
  getDocChecklistData,
  getErrorFields,
  getDefectReasonDropdown,
  getDocHistory,
  getIsLinkingSuccess,
  getInitialDocChecklistData,
  getFilenetCatTypes,
  getLoader,
};

export default selectors;

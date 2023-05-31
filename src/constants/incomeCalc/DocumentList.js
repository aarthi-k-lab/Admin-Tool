const PROPERTY_PRIMARY_USE = 'Doc Review Status';
const TASK_BLUEPRINT_CODE = 'DOC_CHKLST_BORR_LIST';
const DECEASED_BORROWER = 'ESTATE OF';
const UNCLASSIFIED_DOC_TYPE = {
  docTypeCategory: 'UnClassified',
  docTypes: [
    {
      code: 'UNCLASS',
      description: 'UnClassified',
    },
  ],
};
const NOT_PROVIDED_STS = 'Not Provided';
const NOT_REVIEWED_STS = 'Not reviewed';
const DEFECTS_STS = 'Defects';
const CONTRIBUTOR_AFFL_CODE = '98';
const ASSUMPTOR_AFFL_CODE = '99';
const DOC_CHECKLIST = 'doc-checklist';
module.exports = {
  PROPERTY_PRIMARY_USE,
  TASK_BLUEPRINT_CODE,
  DECEASED_BORROWER,
  UNCLASSIFIED_DOC_TYPE,
  NOT_PROVIDED_STS,
  NOT_REVIEWED_STS,
  DEFECTS_STS,
  CONTRIBUTOR_AFFL_CODE,
  ASSUMPTOR_AFFL_CODE,
  DOC_CHECKLIST,
};

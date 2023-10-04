const ERROR = 'error';
const SUCCESS = 'success';
const FAILED = 'failed';
const NOTFOUND = 'NotFound';
const TRUE = 'true';
const FALSE = 'false';
const ALL = 'all';
const ANY = 'any';
const EXCEL_FORMATS = ['xlsx', 'xls'];
const checklistGridColumnSize = {
  title: {
    'income-calculator': 8,
    'expense-calculator': 8,
    'asset-checklist': 8,
    'fico-checklist': 8,
    'asset-checklist-back': 2,
    'sla-rules': 10,
    'doc-checklist': 8,
    default: 6,
  },
  lockedDate: {
    default: 1,
  },
  lockId: {
    default: 2,
  },
  lockedBy: {
    default: 6,
  },
  check: {
    'income-calculator': 1,
    'expense-calculator': 1,
    'asset-verification': 1,
    'fico-score': 1,
    'doc-checklist': 1,
    'asset-checklist': 1,
    'fico-checklist': 1,
    default: 2,
  },
  lock: {
    'income-calculator': 1,
    'expense-calculator': 1,
    'asset-checklist': 1,
    'fico-checklist': 1,
    default: 2,
  },
  prev: {
    'income-calculator': 1,
    'expense-calculator': 1,
    'asset-checklist': 1,
    'sla-rules': 1,
    'fico-score': 1,
    'doc-checklist': 1,
    'fico-checklist': 1,
    default: 2,
  },
  next: {
    'income-calculator': 1,
    'expense-calculator': 1,
    'asset-checklist': 1,
    'sla-rules': 1,
    'fico-score': 1,
    'doc-checklist': 1,
    'fico-checklist': 1,
    default: 2,
  },
  back: {
    default: 1,
  },
  clear: {
    default: 2,
  },
};
const hideClearButton = ['sla-rules', 'income-calculator', 'expense-calculator', 'asset-verification', 'fico-checklist', 'asset-checklist', 'delay-checklist'];
const hidePrevNextButton = ['delay-checklist'];
const financialChecklist = ['income-calculator', 'expense-calculator', 'asset-verification', 'fico-checklist', 'asset-checklist'];
const checklistForms = ['fico-checklist', 'asset-checklist', 'doc-checklist', 'delay-checklist'];

module.exports = {
  NOTFOUND,
  ERROR,
  FAILED,
  SUCCESS,
  TRUE,
  FALSE,
  ALL,
  ANY,
  EXCEL_FORMATS,
  checklistGridColumnSize,
  hideClearButton,
  hidePrevNextButton,
  financialChecklist,
  checklistForms,
};

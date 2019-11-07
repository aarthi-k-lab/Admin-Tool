import Messages from './Messages';


const FEUW = 'FEUW';
const BEUW = 'BEUW';
const PROC = 'PROC';
const LOAN_ACTIVITY = 'LA';
const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';
const BEUW_TASKS_AND_CHECKLIST = 'beuw-task-checklist';
const DOC_GEN = 'DOCGEN';
const STAGER_TABLE_PAGE_COUNT = 100;
const DOC_GEN_BACK = 'DGB';
const DOCS_IN_BACK = 'DIB';
const DOCS_IN = 'DOCSIN';
const STAGER = 'STAGER';
const POSTMODSTAGER = 'POSTMOD';
const ALL_STAGER = 'ALLSTAGER';
const POSTMOD_TASKNAMES = ['Countersign', 'FNMA QC', 'Incentive', 'Investor Settlement', 'Recordation', 'Recordation-Ordered', 'Recordation-ToOrder', 'Send Mod Agreement'];
const CHECKLIST_TASKNAMES = ['FrontEnd Review', 'Processing', 'Underwriting', 'Document Generation', 'Docs In', ...POSTMOD_TASKNAMES];
const ALLOW_IN_QUEUE = ['Trial Modification', 'Forbearance'];
const STAGER_VALUE = {
  UW_STAGER: 'UW_STAGER',
  DOCGEN_STAGER: 'DOCGEN_STAGER',
  STAGER_ALL: 'STAGER_ALL',
  POSTMOD_STAGER_ALL: 'POSTMOD_STAGER_ALL',
  ALL: 'ALL',
};
const GROUP_INFO = [
  {
    group: FEUW,
    task: 'Income Calculation',
    taskCode: 'UW',
    path: '/frontend-evaluation',
    showAssignUnassign: true,
  },
  {
    group: BEUW,
    task: 'Underwriting',
    taskCode: 'UW',
    path: '/backend-evaluation',
    showAssignUnassign: true,
  },
  {
    group: FEUW,
    task: 'Income Calculation',
    taskCode: 'UW',
    path: '/frontend-checklist',
    showAssignUnassign: true,
  },
  {
    group: PROC,
    task: 'Processing',
    taskCode: 'PROC',
    path: '/doc-processor',
    showAssignUnassign: true,

  },
  {
    group: BEUW,
    task: 'Underwriting',
    taskCode: 'UW',
    path: '/backend-checklist',
    showAssignUnassign: true,
  },
  {
    group: LOAN_ACTIVITY,
    task: 'Trial',
    taskCode: 'LA',
    path: '/loan-activity',
    showAssignUnassign: false,

  },
  {
    group: DOC_GEN_BACK,
    task: 'Approved for Doc Generation',
    taskCode: 'DGB',
    path: '/doc-gen-back',
    showAssignUnassign: false,
  },
  {
    group: DOCS_IN_BACK,
    task: 'Mod Booked',
    taskCode: 'DIB',
    path: '/docs-In-back',
    showAssignUnassign: false,
  },
  {
    group: DOC_GEN,
    task: 'DOC GENERATION',
    taskCode: 'UW',
    path: '/doc-gen',
    showAssignUnassign: true,
  },
  {
    group: DOCS_IN,
    task: 'DOCS IN',
    taskCode: 'DOCSIN',
    path: '/docs-in',
    showAssignUnassign: true,
  },
  {
    group: POSTMODSTAGER,
    task: 'POST MOD STAGER',
    taskCode: 'POST MOD STAGER',
    path: '/postmodstager',
    showAssignUnassign: true,
  },
  {
    group: '',
    task: 'Unrecognized Dashboard',
    taskCode: '',
    path: '',
    showAssignUnassign: false,
  },
];
const GROUPS = {
  '/frontend-evaluation': FEUW,
  '/backend-evaluation': BEUW,
  '/backend-checklist': BEUW,
  // TO-DO'S
  '/loan-activity': LOAN_ACTIVITY,
  '/doc-processor': PROC,
  '/doc-gen': DOC_GEN,
  '/docs-in': DOCS_IN,
};

function getTitle(location) {
  switch (location) {
    case '/backend-evaluation':
      return 'Underwriting';
    case '/frontend-evaluation':
      return 'Income Calculation';
    case '/frontend-checklist':
      return 'Income Calculation (beta)';
    case '/backend-checklist':
      return 'Underwriting (beta)';
    case '/doc-processor':
      return 'Processing';
    case '/loan-activity':
      return 'Loan Activity';
    case '/doc-gen':
      return 'Doc Gen';
    case '/docs-in':
      return 'DocsIn';
    default:
      return 'Unrecognized Dashboard';
  }
}

const DashboardModel = {
  FEUW,
  BEUW,
  PROC,
  DOC_GEN,
  DOCS_IN,
  LOAN_ACTIVITY,
  FEUW_TASKS_AND_CHECKLIST,
  BEUW_TASKS_AND_CHECKLIST,
  GROUPS,
  GROUP_INFO,
  getTitle,
  Messages,
  ALLOW_IN_QUEUE,
  STAGER_VALUE,
  STAGER_TABLE_PAGE_COUNT,
  POSTMODSTAGER,
  STAGER,
  ALL_STAGER,
  CHECKLIST_TASKNAMES,
  POSTMOD_TASKNAMES,
};

export default DashboardModel;

import Messages from './Messages';


const FEUW = 'FEUW';
const BEUW = 'BEUW';
const PROC = 'PROC';
const PROCMGR = 'PROC-mgr';
const LOAN_ACTIVITY = 'LA';
const DOC_GEN = 'DOCGEN';
const STAGER_TABLE_PAGE_COUNT = 100;
const DOC_GEN_BACK = 'DGB';
const DOCS_IN_BACK = 'DIB';
const DOCS_IN = 'DOCSIN';
const BOOKING = 'BOOKING';
const COVIUS = 'docgenvendor';
const FHLMCRESOLVE = 'FHLMCResolve';

const EVENT_CATEGORY_FILTER = 'SubmitFullmentRequest';
const STAGER = 'STAGER';
const POSTMODSTAGER = 'POSTMOD';
const ALL_STAGER = 'ALLSTAGER';
const POSTMOD_TASKNAMES = ['Countersign', 'FNMA QC', 'Incentive', 'Investor Settlement', 'Recordation', 'Recordation-Ordered', 'Recordation-ToOrder', 'Send Mod Agreement', 'Pending Buyout - Countersign', '258A Recordation-Ordered', '258A Recordation-ToOrder', 'Assumption Agreement Recordation-Ordered', 'Assumption Agreement Recordation-ToOrder', 'Modification Agreement Recordation-Ordered', 'Modification Agreement Recordation-ToOrder', 'Partial Claim Recordation-Ordered', 'Partial Claim Recordation-ToOrder', 'Recordation-ToOrder'];
const ALLOW_IN_QUEUE = ['Trial Modification', 'Forbearance'];
const PENDING_BOOKING = 'Pending Booking';
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
    group: BOOKING,
    task: 'Special Loan Automation',
    taskCode: 'BOOKING',
    path: '/special-loan',
    showAssignUnassign: true,
  },
  {
    group: COVIUS,
    task: 'COVIUS',
    taskCode: 'COVIUS',
    path: '/dg-vendor',
    showAssignUnassign: false,
  },
  {
    group: FHLMCRESOLVE,
    task: 'FHLMC RESOLVE',
    taskCode: 'FHLMCRESOLVE',
    path: '/fhlmc-resolve',
    showAssignUnassign: false,
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
  '/frontend-checklist': FEUW,
  '/backend-checklist': BEUW,
  '/loan-activity': LOAN_ACTIVITY,
  '/doc-processor': PROC,
  '/doc-gen': DOC_GEN,
  '/docs-in': DOCS_IN,
  '/special-loan': BOOKING,
  '/dg-vendor': COVIUS,
  '/fhlmcBulkOrder': FHLMCRESOLVE,
};

function getTitle(location) {
  switch (location) {
    case '/frontend-checklist':
      return 'Income Calculation';
    case '/backend-checklist':
      return 'Underwriting';
    case '/doc-processor':
      return 'Processing';
    case '/loan-activity':
      return 'Loan Activity';
    case '/doc-gen':
      return 'Doc Gen';
    case '/docs-in':
      return 'DocsIn';
    case '/special-loan':
      return 'Special Loan Automation';
    case '/dg-vendor':
      return 'COVIUS EVENTS';
    case '/fhlmcBulkOrder':
      return 'FHHLMC RESOLVE';
    default:
      return 'Unrecognized Dashboard';
  }
}

const InvalidEvalResponse = evalId => ({
  statusMessage: 'Eval id you have entered is invalid',
  evalId,
});


const PDD = {
  title: 'Modification Type',
  content: 'Payment Deferral Disaster',
};

const DashboardModel = {
  EVENT_CATEGORY_FILTER,
  FEUW,
  BEUW,
  PROC,
  PROCMGR,
  DOC_GEN,
  DOCS_IN,
  BOOKING,
  COVIUS,
  FHLMCRESOLVE,
  LOAN_ACTIVITY,
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
  POSTMOD_TASKNAMES,
  PENDING_BOOKING,
  InvalidEvalResponse,
  PDD,
};

export default DashboardModel;

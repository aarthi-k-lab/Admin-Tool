import Messages from './Messages';


const FEUW = 'FEUW';
const BEUW = 'BEUW';
const PROC = 'PROC';
const LOAN_ACTIVITY = 'LA';
const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';
const BEUW_TASKS_AND_CHECKLIST = 'beuw-task-checklist';

const PAGE_LOOKUP = [
  {
    group: FEUW,
    task: 'Income Calculation',
    taskCode: 'UW',
    path: '/frontend-evaluation',
  },
  {
    group: BEUW,
    task: 'Underwriting',
    taskCode: 'UW',
    path: '/backend-evaluation',
  },
  {
    group: FEUW_TASKS_AND_CHECKLIST,
    task: 'Income Calculation (beta)',
    taskCode: 'UW',
    path: '/frontend-checklist',
  },
  {
    group: PROC,
    task: 'Processing',
    taskCode: 'PROC',
    path: '/doc-processor',
  },
  {
    group: BEUW_TASKS_AND_CHECKLIST,
    task: 'Underwriting (beta)',
    taskCode: 'UW',
    path: '/backend-checklist',
  },
  {
    // TO-DO
    group: LOAN_ACTIVITY,
    task: 'Loan Activity',
    path: '/loan-activity',
  },
  {
    group: '',
    task: 'Unrecognized Dashboard',
    taskCode: '',
    path: '',
  },
];
const GROUPS = {
  '/frontend-evaluation': FEUW,
  '/backend-evaluation': BEUW,
  '/backend-checklist': BEUW_TASKS_AND_CHECKLIST,
  // TO-DO'S
  '/loan-activity': LOAN_ACTIVITY,
  '/doc-processor': PROC,
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
    default:
      return 'Unrecognized Dashboard';
  }
}

const DashboardModel = {
  FEUW,
  BEUW,
  PROC,
  LOAN_ACTIVITY,
  FEUW_TASKS_AND_CHECKLIST,
  BEUW_TASKS_AND_CHECKLIST,
  GROUPS,
  PAGE_LOOKUP,
  getTitle,
  Messages,
};

export default DashboardModel;

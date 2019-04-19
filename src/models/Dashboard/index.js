import Messages from './Messages';


const FEUW = 'FEUW';
const BEUW = 'BEUW';
const PROC = 'PROC';
const LOAN_ACTIVITY = 'LA';
const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';

const PAGE_LOOKUP = [
  {
    group: FEUW,
    task: 'Income Calculation',
    taskCode: 'UW',
    path: '/frontend-evaluation',
    hasCommentsWidget: true,
  },
  {
    group: BEUW,
    task: 'Underwriting',
    taskCode: 'UW',
    path: '/backend-evaluation',
    hasCommentsWidget: true,
  },
  {
    group: FEUW_TASKS_AND_CHECKLIST,
    task: 'Income Calculation (beta)',
    taskCode: 'UW',
    path: '/frontend-checklist',
    hasCommentsWidget: true,
  },
  {
    group: PROC,
    task: 'Processing',
    taskCode: 'PROC',
    path: '/doc-processor',
    hasCommentsWidget: false,
  },
  {
    // TO-DO
    group: LOAN_ACTIVITY,
    task: 'Loan Activity',
    path: '/loan-activity',
    hasCommentsWidget: false,
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
  GROUPS,
  PAGE_LOOKUP,
  getTitle,
  Messages,
};

export default DashboardModel;

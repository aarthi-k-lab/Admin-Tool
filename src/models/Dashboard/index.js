const FEUW = 'feuw';
const BEUW = 'BEUW';
const DP = 'DP';
const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';

const PAGE_LOOKUP = [
  {
    group: 'FEUW',
    task: '',
    path: '/frontend-evaluation',
  },
  {
    group: 'BEUW',
    task: 'Underwriting',
    path: '/backend-evaluation',
  },
  {
    group: 'FEUW_TASKS_AND_CHECKLIST',
    task: 'Income Calculation',
    path: '/frontend-checklist',
  },
  {
    group: 'DP',
    task: 'Processing',
    path: '/doc-processor',
  },
  {
    group: '',
    task: 'Unrecognized Dashboard',
    path: '',
  },
];
const GROUPS = {
  '/frontend-evaluation': 'FEUW',
  '/backend-evaluation': 'BEUW',
  // TO-DO
  '/doc-processor': 'DP',
};

function getTitle(location) {
  switch (location) {
    case '/backend-evaluation':
      return 'Underwriting';
    case '/frontend-evaluation':
    case '/frontend-checklist':
      return 'Income Calculation';
    case '/doc-processor':
      return 'Processing';
    default:
      return 'Unrecognized Dashboard';
  }
}

const DashboardModel = {
  FEUW,
  BEUW,
  DP,
  FEUW_TASKS_AND_CHECKLIST,
  GROUPS,
  PAGE_LOOKUP,
  getTitle,
};

export default DashboardModel;

const FEUW = 'feuw';
const BEUW = 'BEUW';
const DP = 'DP';
const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';

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
  getTitle,
};

export default DashboardModel;

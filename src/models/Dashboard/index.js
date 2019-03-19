const FEUW = 'feuw';
const BEUW = 'BEUW';
const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';

const GROUPS = {
  '/frontend-evaluation': 'FEUW',
  '/backend-evaluation': 'BEUW',
};

function getTitle(location) {
  switch (location) {
    case '/backend-evaluation':
      return 'Underwriting';
    case '/frontend-evaluation':
    case '/frontend-checklist':
      return 'Income Calculation';
    default:
      return 'Unrecognized Dashboard';
  }
}

const DashboardModel = {
  FEUW,
  BEUW,
  FEUW_TASKS_AND_CHECKLIST,
  GROUPS,
  getTitle,
};

export default DashboardModel;

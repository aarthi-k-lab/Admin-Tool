const R = require('ramda');

const managerDashboard = {
  path: '/reports',
  name: 'dashboard',
  img: '/static/img/icon-dashboard.png',
  groups: ['feuw-mgr', 'beuw-mgr'],
};

const stager = {
  path: '/stager',
  name: 'stager',
  img: '/static/img/stager.svg',
  groups: ['feuw-mgr', 'beuw-mgr', 'stager', 'stager-mgr'],
};

const moveForward = {
  path: '/move-forward',
  name: 'move-forward',
  img: '/static/img/move_forward.svg',
  groups: ['util-mgr', 'allaccess'],
};

const backendUnderwriter = {
  path: '/backend-evaluation',
  name: 'backend-evaluation',
  img: '/static/img/backend.svg',
  groups: ['beuw', 'beuw-mgr'],
};

const feuwTasksAndChecklist = {
  path: '/frontend-checklist',
  name: 'frontend-checklist',
  img: '/static/img/frontend.svg',
  groups: ['allaccess'],
};

const links = [
  managerDashboard,
  {
    path: '/frontend-evaluation',
    name: 'frontend-evaluation',
    img: '/static/img/frontend.svg',
    groups: ['feuw', 'feuw-mgr'],
  },
  backendUnderwriter,
  stager,
  moveForward,
  feuwTasksAndChecklist,
];

function hasManagerDashboardAccess(groups) {
  if (!R.is(Array, groups)) {
    return true;
  }
  return managerDashboard.groups.some(managerGroup => groups.includes(managerGroup));
}

function hasStagerDashboardAccess(groups) {
  if (!R.is(Array, groups)) {
    return true;
  }
  return stager.groups.some(stagerGroup => groups.includes(stagerGroup));
}

function hasMoveForwardAccess(groups) {
  if (!R.is(Array, groups)) {
    return true;
  }
  return moveForward.groups.some(moveForwardGroup => groups.includes(moveForwardGroup));
}

module.exports = {
  links,
  hasManagerDashboardAccess,
  hasMoveForwardAccess,
  hasStagerDashboardAccess,
};

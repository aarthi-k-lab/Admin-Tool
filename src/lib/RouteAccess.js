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

const docProcessor = {
  path: '/doc-processor',
  name: 'doc-processor',
  img: '/static/img/docprocessor.svg',
  groups: ['feuw', 'feuw-mgr'],
};

const frontendUnderwriter = {
  path: '/frontend-evaluation',
  name: 'frontend-evaluation',
  img: '/static/img/frontend.svg',
  groups: ['feuw', 'feuw-mgr'],
};

const backendUnderwriter = {
  path: '/backend-evaluation',
  name: 'backend-evaluation',
  img: '/static/img/backend.svg',
  groups: ['beuw', 'beuw-mgr', 'allaccess'],
};

const feuwTasksAndChecklist = {
  path: '/frontend-checklist',
  name: 'frontend-checklist',
  img: '/static/img/frontend.svg',
  groups: ['allaccess'],
};

const links = [
  managerDashboard,
  docProcessor,
  frontendUnderwriter,
  backendUnderwriter,
  stager,
  moveForward,
  feuwTasksAndChecklist,
];

function hasGroup(requiredGroups, userGroups) {
  if (!R.is(Array, userGroups)) {
    return true;
  }
  return requiredGroups.some(group => userGroups.includes(group));
}

function hasFrontendUnderwriterAccess(groups) {
  return hasGroup(frontendUnderwriter.groups, groups);
}

function hasFrontendChecklistAccess(groups) {
  return hasGroup(feuwTasksAndChecklist.groups, groups);
}

function hasBackendUnderwriterAccess(groups) {
  return hasGroup(backendUnderwriter.groups, groups);
}

function hasManagerDashboardAccess(groups) {
  return hasGroup(managerDashboard.groups, groups);
}

function hasStagerDashboardAccess(groups) {
  return hasGroup(stager.groups, groups);
}

function hasMoveForwardAccess(groups) {
  return hasGroup(moveForward.groups, groups);
}

module.exports = {
  links,
  hasBackendUnderwriterAccess,
  hasFrontendUnderwriterAccess,
  hasFrontendChecklistAccess,
  hasManagerDashboardAccess,
  hasMoveForwardAccess,
  hasStagerDashboardAccess,
};

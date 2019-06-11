const R = require('ramda');

const managerDashboard = {
  path: '/reports',
  name: 'dashboard',
  img: '/static/img/icon-dashboard.png',
  groups: ['feuw-mgr', 'beuw-mgr', 'proc-mgr'],
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

const frontendUnderwriter = {
  path: '/frontend-evaluation',
  name: 'frontend-evaluation',
  img: '/static/img/frontend.svg',
  groups: ['feuw', 'feuw-mgr'],
  notInGroup: ['beta'],
};

const backendUnderwriter = {
  path: '/backend-evaluation',
  name: 'backend-evaluation',
  img: '/static/img/backend.svg',
  groups: ['beuw', 'beuw-mgr'],
};

const docProcessor = {
  path: '/doc-processor',
  name: 'doc-processor',
  img: '/static/img/doc-processor.svg',
  groups: ['proc', 'proc-mgr', 'allaccess'],
};

const feuwTasksAndChecklist = {
  path: '/frontend-checklist',
  name: 'frontend-checklist',
  img: '/static/img/fe_beta.svg',
  groups: ['allaccess', 'feuw-beta', 'beta'],
  notInGroup: ['feuw', 'feuw-mgr'],
};

const beuwTasksAndChecklist = {
  path: '/backend-checklist',
  name: 'backend-checklist',
  img: '/static/img/be_beta.svg',
  groups: ['allaccess', 'beuw-beta'],
  notInGroup: ['beuw', 'beuw-mgr'],
};

const checkListGroups = {
  groups: ['allaccess', 'feuw-beta', 'beta', 'proc', 'proc-mgr', 'beuw'],
};

// TO DO
const loanActivity = {
  path: '/loan-activity',
  name: 'loan-activity',
  img: '/static/img/loan-activity.svg',
  groups: ['allaccess', 'trial', 'trial-mgr', 'feuw', 'feuw-mgr', 'feuw-beta', 'beta', 'proc', 'proc-mgr', 'beuw', 'beuw-mgr', 'util-mgr', 'stager', 'stager-mgr'],
};

const links = [
  managerDashboard,
  docProcessor,
  frontendUnderwriter,
  feuwTasksAndChecklist,
  backendUnderwriter,
  beuwTasksAndChecklist,
  stager,
  moveForward,
  loanActivity,
];

const noIcons = ['/loan-activity'];

function hasGroup(requiredGroups, userGroups, notInGroup) {
  if (!R.is(Array, userGroups)) {
    return true;
  }
  if (!notInGroup) {
    return requiredGroups.some(group => userGroups.includes(group));
  }
  return requiredGroups.some(group => userGroups.includes(group))
    && !(notInGroup.some(group => userGroups.includes(group)));
}

function shouldShowIcon(link, userGroups) {
  return R.indexOf(link.path, noIcons) === -1 && hasGroup(link.groups, userGroups, link.notInGroup);
}

function hasFrontendUnderwriterAccess(groups) {
  return hasGroup(frontendUnderwriter.groups, groups, frontendUnderwriter.notInGroup);
}

function hasFrontendChecklistAccess(groups) {
  return hasGroup(feuwTasksAndChecklist.groups, groups);
}

function hasBackendChecklistAccess(groups) {
  return hasGroup(beuwTasksAndChecklist.groups, groups);
}

function hasChecklistAccess(groups) {
  return hasGroup(checkListGroups.groups, groups);
}

function hasLoanActivityAccess(groups) {
  return hasGroup(loanActivity.groups, groups);
}

function hasBackendUnderwriterAccess(groups) {
  return hasGroup(backendUnderwriter.groups, groups);
}

function hasDocProcessorAccess(groups) {
  return hasGroup(docProcessor.groups, groups);
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
  hasDocProcessorAccess,
  hasFrontendUnderwriterAccess,
  hasBackendChecklistAccess,
  hasFrontendChecklistAccess,
  hasManagerDashboardAccess,
  hasMoveForwardAccess,
  hasStagerDashboardAccess,
  hasLoanActivityAccess,
  shouldShowIcon,
  hasChecklistAccess,
};

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
  groups: ['beuw', 'beuw-mgr', 'allaccess'],
};

const docProcessor = {
  path: '/doc-processor',
  name: 'doc-processor',
  img: '/static/img/doc-processor.svg',
  groups: ['proc', 'proc-mgr'],
};

const feuwTasksAndChecklist = {
  path: '/frontend-checklist',
  name: 'frontend-checklist',
  img: '/static/img/fe_beta.svg',
  groups: ['allaccess', 'feuw-beta', 'beta'],
};

// TO DO
const loanActivity = {
  path: '/loan-activity',
  name: 'loan-activity',
  img: '/static/img/loan-activity.svg',
  groups: ['cmod-dev-trial', 'cmod-dev-trial-mgr', 'cmod-qa-trial',
    'cmod-qa-trial-mgr', 'cmod-uat-trial', 'cmod-uat-trial-mgr',
    'cmod-prod-trial', 'cmod-prod-trial-mgr'],
};

const links = [
  managerDashboard,
  docProcessor,
  frontendUnderwriter,
  backendUnderwriter,
  stager,
  moveForward,
  feuwTasksAndChecklist,
  loanActivity,
];

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
  return hasGroup(link.groups, userGroups, link.notInGroup);
}

function hasFrontendUnderwriterAccess(groups) {
  return hasGroup(frontendUnderwriter.groups, groups, frontendUnderwriter.notInGroup);
}

function hasFrontendChecklistAccess(groups) {
  return hasGroup(feuwTasksAndChecklist.groups, groups);
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
  hasFrontendChecklistAccess,
  hasManagerDashboardAccess,
  hasMoveForwardAccess,
  hasStagerDashboardAccess,
  hasLoanActivityAccess,
  shouldShowIcon,
};

const R = require('ramda');

const checkListGroups = {
  groups: ['allaccess', 'feuw', 'beta', 'proc', 'proc-mgr', 'beuw', 'docsin', 'postmodstager'],
};

const managerDashboard = {
  path: '/reports',
  name: 'dashboard',
  img: '/static/img/icon-dashboard.png',
  groups: ['feuw-mgr', 'beuw-mgr', 'proc-mgr', 'docgen-mgr', 'docsin-mgr', 'postmodstager-mgr', 'booking-mgr'],
};

const stager = {
  path: '/stager',
  name: 'stager',
  img: '/static/img/stager.svg',
  groups: ['feuw-mgr', 'beuw-mgr', 'stager', 'stager-mgr', 'postmodstager', 'postmodstager-mgr'],
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
  img: '/static/img/doc-processor.svg',
  groups: ['proc', 'proc-mgr', 'allaccess'],
};

const feuwTasksAndChecklist = {
  path: '/frontend-checklist',
  name: 'frontend-checklist',
  img: '/static/img/frontend.svg',
  groups: ['allaccess', 'feuw-beta', 'feuw', 'feuw-mgr'],
};

const beuwTasksAndChecklist = {
  path: '/backend-checklist',
  name: 'backend-checklist',
  img: '/static/img/backend.svg',
  groups: ['allaccess', 'beuw-beta', 'beuw', 'beuw-mgr'],
};


// TO DO
const loanActivity = {
  path: '/loan-activity',
  name: 'loan-activity',
  img: '/static/img/loan-activity.svg',
  groups: ['allaccess', 'trial', 'trial-mgr', 'feuw', 'feuw-mgr', 'feuw-beta', 'beta', 'proc', 'proc-mgr', 'beuw', 'beuw-mgr', 'util-mgr', 'stager', 'stager-mgr', 'docgen', 'docgen-mgr', 'docsin', 'docsin-mgr', 'postmodstager', 'booking', 'postmodstager-mgr', 'booking-mgr'],
};

const docGenBack = {
  path: '/doc-gen-back',
  name: 'doc-gen-back',
  img: '/static/img/doc_gen.svg',
  groups: ['allaccess', 'docgen', 'docgen-mgr'],
};

const docsInBack = {
  path: '/docs-in-back',
  name: 'docs-in-back',
  img: '/static/img/doc_gen.svg',
  groups: ['allaccess', 'docsin-mgr'],
};

const docGen = {
  path: '/doc-gen',
  name: 'doc-gen',
  img: '/static/img/doc-gen.svg',
  groups: ['allaccess', 'docgen', 'docgen-mgr'],
};

// docsin and docsin-mgr
const docIns = {
  path: '/docs-in',
  name: 'docs-in',
  img: '/static/img/docs-in.svg',
  groups: ['allaccess', 'docsin', 'docsin-mgr'],
};

const docInsPage = {
  path: '/bulkOrder-page',
  name: 'bulkOrder-page',
  img: '/static/img/docs-in.svg',
  groups: ['allaccess', 'docsin', 'docsin-mgr'],
};

// Special Loan Automation
const BOOKING = {
  path: '/special-loan',
  name: 'booking',
  img: '/static/img/sla.svg',
  groups: ['allaccess', 'booking', 'booking-mgr'],
};

const trial = {
  groups: ['trial-mgr', 'feuw-mgr', 'beuw-mgr', 'proc-mgr', 'docgen-mgr', 'docsin-mgr', 'stager-mgr', 'postmodstager-mgr', 'booking-mgr'],
};

const links = [
  managerDashboard,
  docProcessor,
  feuwTasksAndChecklist,
  beuwTasksAndChecklist,
  stager,
  moveForward,
  loanActivity,
  docGenBack,
  docsInBack,
  docGen,
  docIns,
  docInsPage,
  BOOKING,
];

const noIcons = ['/loan-activity', '/doc-gen-back', '/bulkOrder-page', '/docs-in-back'];

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
  return !noIcons.includes(link.path) && hasGroup(link.groups, userGroups, link.notInGroup);
}

function hasFrontendChecklistAccess(groups) {
  return hasGroup(feuwTasksAndChecklist.groups, groups);
}

function hasTrialManagerDashboardAccess(groups) {
  return hasGroup(trial.groups, groups);
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

function hasDocProcessorAccess(groups) {
  return hasGroup(docProcessor.groups, groups);
}

function hasDocGenAccess(groups) {
  return hasGroup(docGen.groups, groups);
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

// function hasDocGenBackAccess(groups) {
//   return hasGroup(docGenBack.groups, groups);
// }

// function hasDocsInBackAccess(groups) {
//   return hasGroup(docsInBack.groups, groups);
// }

function hasDocInsAccess(groups) {
  return hasGroup(docIns.groups, groups);
}

function hasSlaAccess(groups) {
  return hasGroup(BOOKING.groups, groups);
}
function getStagerGroup(groups) {
  let groupName = '';
  const stagerGroups = ['stager-mgr', 'stager'];
  const postModGroups = ['postmodstager', 'postmodstager-mgr'];
  const isStagerGroup = groups && R.any(group => R.contains(group, stagerGroups), groups);
  const isPostModStagerGroup = groups && R.any(group => R.contains(group, postModGroups), groups);
  if (isStagerGroup && isPostModStagerGroup) {
    groupName = 'ALLSTAGER';
  } else {
    groupName = isPostModStagerGroup ? 'POSTMOD' : 'STAGER';
  }

  return groupName;
}

module.exports = {
  links,
  hasDocProcessorAccess,
  hasBackendChecklistAccess,
  hasFrontendChecklistAccess,
  hasManagerDashboardAccess,
  hasMoveForwardAccess,
  hasStagerDashboardAccess,
  hasLoanActivityAccess,
  hasTrialManagerDashboardAccess,
  shouldShowIcon,
  hasChecklistAccess,
  // hasDocGenBackAccess,
  // hasDocsInBackAccess,
  hasDocGenAccess,
  hasDocInsAccess,
  hasSlaAccess,
  getStagerGroup,
};

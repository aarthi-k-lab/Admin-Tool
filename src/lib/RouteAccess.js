const R = require('ramda');

const checkListGroups = {
  groups: ['allaccess', 'feuw', 'beta', 'proc', 'proc-mgr', 'beuw', 'docsin', 'postmodstager', 'invset', 'invset-mgr', 'secondlook', 'secondlook-mgr'],
};

const managerDashboard = {
  path: '/reports',
  name: 'dashboard',
  img: '/static/img/icon-dashboard.png',
  groups: ['feuw-mgr', 'beuw-mgr', 'proc-mgr', 'docgen-mgr', 'docsin-mgr', 'postmodstager-mgr', 'booking-mgr', 'docgenvendor-mgr', 'invset-mgr', 'secondlook-mgr', 'lossmitigation-mgr'],
};

const stager = {
  path: '/stager',
  name: 'stager',
  img: '/static/img/stager.svg',
  groups: ['feuw-mgr', 'beuw-mgr', 'stager', 'stager-mgr', 'postmodstager', 'postmodstager-mgr', 'rpsstager', 'rpsstager-mgr'],
};

const moveForward = {
  path: '/move-forward',
  name: 'move-forward',
  img: '/static/img/move_forward.svg',
  groups: ['util-mgr'],
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
// Covius
const COVIUS = {
  path: '/dg-vendor',
  name: 'covius',
  img: '/static/img/covius.svg',
  groups: ['allaccess', 'docgenvendor', 'docgenvendor-mgr'],
};

const coviusBulkOrderPage = {
  path: '/coviusBulkOrder',
  name: 'Covius Navigation Page',
  img: '/static/img/covius.svg',
  groups: ['allaccess', 'docgenvendor', 'docgenvendor-mgr'],
};

// FHLMC Resolve

const fHLMCBulkOrderPage = {
  path: '/fhlmc-resolve',
  name: 'FHLMC RESOLVE Page',
  img: '/static/img/Freddie.svg',
  groups: ['allaccess', 'fhlmcresolve'],
};

const WESTWING = {
  path: '/west-wing',
  name: 'West Wing',
  img: '/static/img/West Wing - menu icon.svg',
  groups: ['lossmitigation', 'lossmitigation-mgr'],
};

const trial = {
  groups: ['trial-mgr', 'feuw-mgr', 'beuw-mgr', 'proc-mgr', 'docgen-mgr', 'docsin-mgr', 'stager-mgr', 'postmodstager-mgr', 'booking-mgr'],
};

const FEUW_MANAGER = 'feuw-mgr';
const milestoneActivity = {
  path: '/milestone-activity',
  name: 'milestone-activity',
  img: '/static/img/loan-activity.svg',
  groups: ['allaccess', 'trial', 'trial-mgr', 'feuw-beta', 'feuw', 'feuw-mgr', 'beuw-beta', 'beuw', 'beuw-mgr', 'proc', 'proc-mgr', 'docgen', 'docgen-mgr', 'docsin', 'docsin-mgr', 'booking', 'booking-mgr', 'docgenvendor', 'docgenvendor-mgr', 'fhlmcresolve', 'stager', 'stager-mgr', 'postmodstager', 'postmodstager-mgr', 'util-mgr', 'util'],
};

const INVESTOR_SETTLEMENT = {
  path: '/investor-settlement',
  name: 'Investor Settlement',
  img: '/static/img/investor_settlement.svg',
  groups: ['invset', 'invset-mgr'],
};

const SECOND_LOOK = {
  path: '/second-look',
  name: 'Second Look',
  img: '/static/img/second_look.svg',
  groups: ['secondlook', 'secondlook-mgr'],
};


// User Skills

const USER_SKILLS = {
  path: '/user-skills',
  name: 'User Skills',
  img: '/static/img/user_skills.svg',
  groups: ['proc', 'proc-mgr', 'allaccess'],
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
  coviusBulkOrderPage,
  BOOKING,
  COVIUS,
  fHLMCBulkOrderPage,
  milestoneActivity,
  INVESTOR_SETTLEMENT,
  SECOND_LOOK,
  USER_SKILLS,
  WESTWING,
];


const noIcons = ['/loan-activity', '/doc-gen-back', '/bulkOrder-page', '/docs-in-back', '/coviusBulkOrder', '/milestone-activity'];

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

function shouldShowIcon(link, userGroups, hiddenRoutes) {
  if (!R.isEmpty(hiddenRoutes) && hiddenRoutes.includes(link.path)) {
    noIcons.push(link.path);
  }
  return !noIcons.includes(link.path)
    && hasGroup(link.groups, userGroups, link.notInGroup);
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

function hasMilestoneActivityAccess(groups) {
  return hasGroup(milestoneActivity.groups, groups);
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

function hasFrontEndManagerAccess(groups) {
  return R.contains(FEUW_MANAGER, groups);
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

function hasCoviusAccess(groups) {
  return hasGroup(COVIUS.groups, groups);
}

function hasFhlmcResolveAccess(groups) {
  return hasGroup(fHLMCBulkOrderPage.groups, groups);
}

function hasInvestorSettlementAccess(groups) {
  return hasGroup(INVESTOR_SETTLEMENT.groups, groups);
}

function hasSecondLookAccess(groups) {
  return hasGroup(SECOND_LOOK.groups, groups);
}

function hasUserSkillsAccess(groups) {
  return hasGroup(USER_SKILLS.groups, groups);
}

function hasWestWingAccess(groups) {
  return hasGroup(WESTWING.groups, groups);
}

function getStagerGroup(groups) {
  let groupName = '';
  const stagerGroups = ['stager-mgr', 'stager', 'rpsstager-mgr', 'rpsstager'];
  const postModGroups = ['postmodstager', 'postmodstager-mgr', 'rpsstager-mgr', 'rpsstager'];
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
  hasCoviusAccess,
  hasFhlmcResolveAccess,
  getStagerGroup,
  hasFrontEndManagerAccess,
  hasMilestoneActivityAccess,
  hasInvestorSettlementAccess,
  hasSecondLookAccess,
  hasUserSkillsAccess,
  hasWestWingAccess,
};

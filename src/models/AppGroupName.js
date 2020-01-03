const R = require('ramda');

const {
  BEUW_TASKS_AND_CHECKLIST,
  FEUW_TASKS_AND_CHECKLIST,
  BEUW,
  DOC_GEN,
  DOCS_IN,
  BETA,
  userGroupList,
  checklistGroupNames,
} = require('../constants/appGroupName');

const slaGroups = ['booking', 'booking-mgr'];

function disableGroups(role, groups, group) {
  if (R.equals(group, BETA) && !R.equals(groups.indexOf(group.toLowerCase()), -1)) {
    return false;
  }
  return !(R.equals(role, 'Manager') ? !R.equals(groups.indexOf(`${group.toLowerCase()}-mgr`), -1) : !R.equals(groups.indexOf(`${group.toLowerCase()}`), -1));
}

function hasChecklist(appGroupName) {
  return checklistGroupNames.includes(appGroupName);
}

function isSLAGroup(groups) {
  return R.any(group => R.contains(group, slaGroups), groups);
}

module.exports = {
  BEUW_TASKS_AND_CHECKLIST,
  FEUW_TASKS_AND_CHECKLIST,
  disableGroups,
  hasChecklist,
  BEUW,
  DOC_GEN,
  DOCS_IN,
  userGroupList,
  isSLAGroup,
};

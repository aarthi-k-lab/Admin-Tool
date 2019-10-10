const R = require('ramda');

const BEUW_TASKS_AND_CHECKLIST = 'beuw-task-checklist';
const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';
const FEUW = 'FEUW';
const BEUW = 'BEUW';
const DOC_PROCESSOR = 'PROC';
const DOC_GEN = 'DOCGEN';
const DOCS_IN = 'DOCSIN';
const BETA = 'BETA';

const checklistGroupNames = [
  DOC_PROCESSOR,
  FEUW,
  FEUW_TASKS_AND_CHECKLIST,
  BEUW_TASKS_AND_CHECKLIST,
  BEUW,
  DOC_GEN,
  DOCS_IN,
];

const userGroupList = [
  DOC_PROCESSOR,
  FEUW,
  BEUW,
  DOC_GEN,
  DOCS_IN,
  BETA,
];

const appGroupNameToUserPersonaMap = {
  [FEUW_TASKS_AND_CHECKLIST]: 'FEUW',
  [BEUW_TASKS_AND_CHECKLIST]: 'BEUW',
};

function disableGroups(role, groups, group) {
  if (R.equals(group, BETA) && !R.equals(groups.indexOf(group.toLowerCase()), -1)) {
    return false;
  }
  return !(R.equals(role, 'Manager') ? !R.equals(groups.indexOf(`${group.toLowerCase()}-mgr`), -1) : !R.equals(groups.indexOf(`${group.toLowerCase()}`), -1));
}

function getUserPersona(appGroupName) {
  const persona = appGroupNameToUserPersonaMap[appGroupName];
  if (persona === undefined) {
    return appGroupName;
  }
  return persona;
}


function hasChecklist(appGroupName) {
  return checklistGroupNames.includes(appGroupName);
}

module.exports = {
  BEUW_TASKS_AND_CHECKLIST,
  FEUW_TASKS_AND_CHECKLIST,
  getUserPersona,
  disableGroups,
  hasChecklist,
  BEUW,
  DOC_GEN,
  DOCS_IN,
  userGroupList,
};

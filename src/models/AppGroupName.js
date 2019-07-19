const BEUW_TASKS_AND_CHECKLIST = 'beuw-task-checklist';
const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';
const FEUW = 'FEUW';
const BEUW = 'BEUW';
const DOC_PROCESSOR = 'PROC';
const DOC_GEN = 'DOCGEN';

const checklistGroupNames = [
  DOC_PROCESSOR,
  FEUW,
  FEUW_TASKS_AND_CHECKLIST,
  BEUW_TASKS_AND_CHECKLIST,
  BEUW,
  DOC_GEN,
];

const appGroupNameToUserPersonaMap = {
  [FEUW_TASKS_AND_CHECKLIST]: 'FEUW',
  [BEUW_TASKS_AND_CHECKLIST]: 'BEUW',
};

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
  hasChecklist,
  BEUW,
  DOC_GEN,
};

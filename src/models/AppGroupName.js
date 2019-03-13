const FEUW_TASKS_AND_CHECKLIST = 'feuw-task-checklist';

const checklistGroupNames = [
  FEUW_TASKS_AND_CHECKLIST,
];

const appGroupNameToUserPersonaMap = {
  [FEUW_TASKS_AND_CHECKLIST]: 'FEUW',
};

function getUserPersona(appGroupName) {
  const persona = appGroupNameToUserPersonaMap[appGroupName];
  if (persona === undefined) {
    return appGroupName;
  }
  return persona;
}

function shouldGetChecklist(appGroupName) {
  return checklistGroupNames.includes(appGroupName);
}

module.exports = {
  FEUW_TASKS_AND_CHECKLIST,
  getUserPersona,
  shouldGetChecklist,
};

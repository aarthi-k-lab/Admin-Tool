import * as R from 'ramda';

const getUsers = state => R.pathOr([], ['userSkills', 'users'], state);
const getEvents = state => R.pathOr([], ['userSkills', 'events'], state);
const getSelectedUser = state => R.pathOr(null, ['userSkills', 'selectedUser'], state);
const getSelectedEvent = state => R.pathOr(null, ['userSkills', 'selectedEvent'], state);
const getSkills = state => R.pathOr([], ['userSkills', 'skills'], state);
const getUserSkills = state => R.pathOr([], ['userSkills', 'userSkills'], state);
const getUpdatedUserSkills = state => R.pathOr([], ['userSkills', 'updatedUserSkills'], state);
const getNewUserSkills = state => R.pathOr([], ['userSkills', 'newUserSkills'], state);
const getSkillHistory = state => R.pathOr([], ['userSkills', 'skillHistory'], state);
const getSkillDesc = state => R.pathOr([], ['userSkills', 'skillDesc'], state);
const getAddSkillBtn = state => R.pathOr(false, ['userSkills', 'addSkillBtn'], state);
const getClearSaveBtn = state => R.pathOr(false, ['userSkills', 'clearSaveBtn'], state);
const getIsEditEnabled = state => R.pathOr(false, ['userSkills', 'isEditEnabled'], state);
const getAddSkillDialog = state => R.pathOr(false, ['userSkills', 'addSkillDialog'], state);
const getSkillHistoryDialog = state => R.pathOr(false, ['userSkills', 'skillHistoryDialog'], state);

const selectors = {
  getUsers,
  getEvents,
  getSelectedUser,
  getSelectedEvent,
  getSkills,
  getUserSkills,
  getUpdatedUserSkills,
  getNewUserSkills,
  getSkillHistory,
  getSkillDesc,
  getAddSkillBtn,
  getClearSaveBtn,
  getIsEditEnabled,
  getAddSkillDialog,
  getSkillHistoryDialog,
};

export default selectors;

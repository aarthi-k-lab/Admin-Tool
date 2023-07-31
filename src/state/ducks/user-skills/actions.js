import {
  FETCH_USERS,
  FETCH_EVENTS,
  SET_SELECTED_USER,
  SET_SELECTED_EVENT,
  FETCH_SKILLS,
  CHECK_SKILLS,
  FETCH_USER_SKILLS,
  CHECK_USER_SKILLS,
  ADD_USER_SKILLS,
  UPDATE_USER_SKILLS,
  SORT_USER_SKILLS,
  CLEAR_UPDATE_USER_SKILLS,
  SAVE_UPDATE_USER_SKILLS,
  ENABLE_USER_SKILLS,
  FETCH_SKILL_HISTORY,
  SET_ADD_SKILL_BTN,
  SET_CLEAR_SAVE_BTN,
  SET_ADD_SKILL_DIALOG,
  SET_SKILL_HISTORY_DIALOG,
  CLEAR_INFO,
} from './types';

const fetchUsers = payload => ({
  type: FETCH_USERS,
  payload,
});

const fetchEvents = payload => ({
  type: FETCH_EVENTS,
  payload,
});

const setSelectedUser = payload => ({
  type: SET_SELECTED_USER,
  payload,
});

const setSelectedEvent = payload => ({
  type: SET_SELECTED_EVENT,
  payload,
});

const fetchSkills = payload => ({
  type: FETCH_SKILLS,
  payload,
});

const checkUserSkills = payload => ({
  type: CHECK_USER_SKILLS,
  payload,
});

const checkSkills = payload => ({
  type: CHECK_SKILLS,
  payload,
});

const fetchUserSkills = payload => ({
  type: FETCH_USER_SKILLS,
  payload,
});

const addUserSkills = payload => ({
  type: ADD_USER_SKILLS,
  payload,
});

const updateUserSkills = payload => ({
  type: UPDATE_USER_SKILLS,
  payload,
});

const sortUserSkills = payload => ({
  type: SORT_USER_SKILLS,
  payload,
});

const clearUpdateUserSkills = payload => ({
  type: CLEAR_UPDATE_USER_SKILLS,
  payload,
});

const saveUpdateUserSkills = payload => ({
  type: SAVE_UPDATE_USER_SKILLS,
  payload,
});

const enableUserSkills = payload => ({
  type: ENABLE_USER_SKILLS,
  payload,
});

const fetchSkillHistory = payload => ({
  type: FETCH_SKILL_HISTORY,
  payload,
});

const setAddSkillBtn = payload => ({
  type: SET_ADD_SKILL_BTN,
  payload,
});

const setClearSaveBtn = payload => ({
  type: SET_CLEAR_SAVE_BTN,
  payload,
});

const setAddSkillDialog = payload => ({
  type: SET_ADD_SKILL_DIALOG,
  payload,
});

const setSkillHistoryDialog = payload => ({
  type: SET_SKILL_HISTORY_DIALOG,
  payload,
});

const clearInfo = payload => ({
  type: CLEAR_INFO,
  payload,
});

export {
  fetchUsers,
  fetchEvents,
  setSelectedUser,
  setSelectedEvent,
  fetchSkills,
  checkSkills,
  fetchUserSkills,
  checkUserSkills,
  addUserSkills,
  updateUserSkills,
  sortUserSkills,
  clearUpdateUserSkills,
  saveUpdateUserSkills,
  enableUserSkills,
  fetchSkillHistory,
  setAddSkillBtn,
  setClearSaveBtn,
  setAddSkillDialog,
  setSkillHistoryDialog,
  clearInfo,
};

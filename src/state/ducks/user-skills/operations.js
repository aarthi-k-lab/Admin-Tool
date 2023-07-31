import {
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
} from './actions';

const fetchUsersOperation = dispatch => () => dispatch(fetchUsers());
const fetchEventsOperation = dispatch => () => dispatch(fetchEvents());
const setSelectedUserOperation = dispatch => payload => dispatch(setSelectedUser(payload));
const setSelectedEventOperation = dispatch => payload => dispatch(setSelectedEvent(payload));
const fetchSkillsOperation = dispatch => () => dispatch(fetchSkills());
const checkSkillsOperation = dispatch => payload => dispatch(checkSkills(payload));
const fetchUserSkillsOperation = dispatch => () => dispatch(fetchUserSkills());
const checkUserSkillsOperation = dispatch => payload => dispatch(checkUserSkills(payload));
const addUserSkillsOperation = dispatch => payload => dispatch(addUserSkills(payload));
const updateUserSkillsOperation = dispatch => payload => dispatch(updateUserSkills(payload));
const sortUserSkillsOperation = dispatch => payload => dispatch(sortUserSkills(payload));
const clearUpdateUserSkillsOperation = dispatch => () => dispatch(clearUpdateUserSkills());
const saveUpdateUserSkillsOperation = dispatch => () => dispatch(saveUpdateUserSkills());
const enableUserSkillsOperation = dispatch => payload => dispatch(enableUserSkills(payload));
const fetchSkillHistoryOperation = dispatch => payload => dispatch(fetchSkillHistory(payload));
const setAddSkillBtnOperation = dispatch => payload => dispatch(setAddSkillBtn(payload));
const setClearSaveBtnOperation = dispatch => payload => dispatch(setClearSaveBtn(payload));
const setAddSkillDialogOperation = dispatch => payload => dispatch(setAddSkillDialog(payload));
const setSkillHistoryDialogOperation = dispatch => payload => dispatch(
  setSkillHistoryDialog(payload),
);
const clearInfoOperation = dispatch => () => dispatch(clearInfo());

const operations = {
  fetchUsersOperation,
  fetchEventsOperation,
  setSelectedUserOperation,
  setSelectedEventOperation,
  fetchSkillsOperation,
  checkSkillsOperation,
  fetchUserSkillsOperation,
  checkUserSkillsOperation,
  addUserSkillsOperation,
  updateUserSkillsOperation,
  sortUserSkillsOperation,
  clearUpdateUserSkillsOperation,
  saveUpdateUserSkillsOperation,
  enableUserSkillsOperation,
  fetchSkillHistoryOperation,
  setAddSkillBtnOperation,
  setClearSaveBtnOperation,
  setAddSkillDialogOperation,
  setSkillHistoryDialogOperation,
  clearInfoOperation,
};

export default operations;

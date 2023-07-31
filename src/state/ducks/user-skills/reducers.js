/* eslint no-param-reassign: "error" */
import * as R from 'ramda';
import {
  FETCH_USERS,
  SET_USERS,
  FETCH_EVENTS,
  SET_EVENTS,
  SET_SELECTED_USER,
  SET_SELECTED_EVENT,
  FETCH_SKILLS,
  SET_SKILLS,
  CHECK_SKILLS,
  FETCH_USER_SKILLS,
  SET_USER_SKILLS,
  CHECK_USER_SKILLS,
  ADD_USER_SKILLS,
  UPDATE_USER_SKILLS,
  SORT_USER_SKILLS,
  CLEAR_UPDATE_USER_SKILLS,
  SAVE_UPDATE_USER_SKILLS,
  SAVE_SAGA_UPDATE_USER_SKILLS,
  ENABLE_USER_SKILLS,
  FETCH_SKILL_HISTORY,
  SET_SKILL_HISTORY,
  SET_ADD_SKILL_BTN,
  SET_CLEAR_SAVE_BTN,
  ENABLE_EDIT,
  SET_ADD_SKILL_DIALOG,
  SET_SKILL_HISTORY_DIALOG,
  CLEAR_INFO,
} from './types';

const initialState = {
  users: [],
  events: [],
  currentUser: {},
  selectedUser: {},
  selectedEvent: {},
  skills: [],
  userSkills: [],
  initUserSkills: [],
  newUserSkills: [],
  updatedUserSkills: [],
  skillHistory: [],
  skillDesc: '',
  addSkillBtn: false,
  clearSaveBtn: false,
  isEditEnabled: false,
  addSkillDialog: false,
  skillHistoryDialog: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS: {
      return {
        ...state,
      };
    }

    case SET_USERS: {
      return {
        ...state,
        users: action.payload,
        currentUser: { ...action.payload[0] },
      };
    }

    case FETCH_EVENTS: {
      return {
        ...state,
      };
    }

    case SET_EVENTS: {
      return {
        ...state,
        events: action.payload,
      };
    }

    case SET_SELECTED_USER: {
      let isEditEnabled = true;

      if (state.currentUser.emailAddr === action.payload.emailAddr) {
        isEditEnabled = false;
      }

      return {
        ...state,
        selectedUser: action.payload,
        newUserSkills: [],
        updatedUserSkills: [],
        isEditEnabled,
      };
    }

    case SET_SELECTED_EVENT: {
      let isEditEnabled = true;

      if (state.currentUser.emailAddr === state.selectedUser.emailAddr) {
        isEditEnabled = false;
      }

      return {
        ...state,
        selectedEvent: action.payload,
        newUserSkills: [],
        updatedUserSkills: [],
        isEditEnabled,
      };
    }

    case FETCH_SKILLS: {
      return {
        ...state,
      };
    }

    case SET_SKILLS: {
      return {
        ...state,
        skills: action.payload.map(record => ({ ...record, isChecked: false })),
      };
    }

    case CHECK_SKILLS: {
      return {
        ...state,
        skills: state.skills.map((record) => {
          if (action.payload.count === 'ALL') {
            return { ...record, isChecked: action.payload.value };
          }
          if (action.payload.count === 'ONE' && record.skillId === action.payload.identifier) {
            return { ...record, isChecked: action.payload.value };
          }

          return { ...record };
        }),
      };
    }

    case FETCH_USER_SKILLS: {
      return {
        ...state,
      };
    }

    case SET_USER_SKILLS: {
      return {
        ...state,
        userSkills: action.payload.map(record => ({ ...record, isChecked: false })),
        initUserSkills: action.payload.map(record => ({ ...record, isChecked: false })),
      };
    }

    case CHECK_USER_SKILLS: {
      return {
        ...state,
        userSkills: state.userSkills.map((record) => {
          if (action.payload.count === 'ALL') {
            return { ...record, isChecked: action.payload.value };
          }
          if (action.payload.count === 'ONE' && record.userSkillId === action.payload.identifier) {
            return { ...record, isChecked: action.payload.value };
          }

          return { ...record };
        }),
      };
    }

    case ADD_USER_SKILLS: {
      const generateMaxId = Math.max(...state.userSkills.map(record => record.userSkillId));

      const maxId = Number.isFinite(generateMaxId) ? generateMaxId : 0;

      const newUserSkills = action.payload.map((record, index) => {
        const newUserSkill = {};

        newUserSkill.skillId = record.skillId;
        newUserSkill.emailAddr = state.selectedUser.emailAddr;
        newUserSkill.userSkillId = maxId + index + 1;
        newUserSkill.getNext = 0;
        newUserSkill.qcRequired = 0;
        newUserSkill.breachedIndicator = 0;
        newUserSkill.priority = 0;
        newUserSkill.enableFlag = 'N';
        newUserSkill.isChecked = false;

        return newUserSkill;
      }).filter(
        record => R.find(R.propEq('skillId', record.skillId))(state.userSkills) === undefined,
      );

      return {
        ...state,
        userSkills: [...state.userSkills].concat([...newUserSkills]),
        newUserSkills,
        skills: state.skills.map(record => ({ ...record, isChecked: false })),
      };
    }

    case UPDATE_USER_SKILLS: {
      return {
        ...state,
        userSkills: state.userSkills.map((record) => {
          if (record.userSkillId === action.payload.identifier) {
            if (R.find(R.propEq('userSkillId', action.payload.identifier))(state.updatedUserSkills) === undefined) {
              state.updatedUserSkills = [...state.updatedUserSkills, {
                ...record, [action.payload.key]: action.payload.value,
              }];
            }

            return {
              ...record, [action.payload.key]: action.payload.value,
            };
          }
          return record;
        }),
        newUserSkills: state.newUserSkills.map((record) => {
          if (record.userSkillId === action.payload.identifier) {
            return {
              ...record, [action.payload.key]: action.payload.value,
            };
          }

          return { ...record };
        }),
        updatedUserSkills: state.updatedUserSkills.map((record) => {
          if (record.userSkillId === action.payload.identifier) {
            return {
              ...record, [action.payload.key]: action.payload.value,
            };
          }

          return { ...record };
        }).filter(
          record => R.find(R.propEq('userSkillId', record.userSkillId))(state.newUserSkills) === undefined,
        ),
      };
    }

    case SORT_USER_SKILLS: {
      let sortedData;

      if (action.payload.order === 'descend') {
        sortedData = R.sortWith([R.descend(R.prop(action.payload.columnName))])(state.userSkills);
      } else {
        sortedData = R.sortWith([R.ascend(R.prop(action.payload.columnName))])(state.userSkills);
      }

      return {
        ...state,
        userSkills: sortedData,
      };
    }

    case CLEAR_UPDATE_USER_SKILLS: {
      return {
        ...state,
        userSkills: state.initUserSkills.map(record => ({ ...record })),
        newUserSkills: [],
        updatedUserSkills: [],
      };
    }

    case SAVE_UPDATE_USER_SKILLS: {
      return {
        ...state,
      };
    }

    case SAVE_SAGA_UPDATE_USER_SKILLS: {
      const combinedUserSkills = state.userSkills.map((record) => {
        const updatedUserSkill = R.find(R.propEq('userSkillId', record.userSkillId))(action.payload.updatedUserSkillList);

        if (updatedUserSkill !== undefined) {
          return { ...updatedUserSkill };
        }

        return { ...record };
      }).filter(
        record => R.find(R.propEq('userSkillId', record.userSkillId))(state.newUserSkills) === undefined,
      ).concat([...action.payload.newUserSkillList]);

      return {
        ...state,
        userSkills: combinedUserSkills.map(record => ({ ...record, isChecked: false })),
        initUserSkills: combinedUserSkills.map(record => ({ ...record, isChecked: false })),
        updatedUserSkills: [],
        newUserSkills: [],
        isEditEnabled: true,
      };
    }

    case ENABLE_USER_SKILLS: {
      return {
        ...state,
        userSkills: state.userSkills.map((record) => {
          if (R.find(R.propEq('userSkillId', record.userSkillId))(action.payload.selectedUserSkills) !== undefined) {
            return {
              ...record,
              getNext: action.payload.value,
              qcRequired: action.payload.value,
              breachedIndicator: action.payload.value,
              priority: action.payload.value,
              enableFlag: action.payload.value === 1 ? 'Y' : 'N',
            };
          }

          return { ...record };
        }),
        updatedUserSkills: action.payload.selectedUserSkills.map(
          record => (
            {
              ...record,
              getNext: action.payload.value,
              qcRequired: action.payload.value,
              breachedIndicator: action.payload.value,
              priority: action.payload.value,
              enableFlag: action.payload.value === 1 ? 'Y' : 'N',
            }
          ),
        ),
      };
    }

    case FETCH_SKILL_HISTORY: {
      const userSkill = R.find(R.propEq('userSkillId', action.payload))(state.userSkills);
      const skill = R.find(R.propEq('skillId', userSkill.skillId))(state.skills);

      return {
        ...state,
        skillDesc: skill.skillDesc,
      };
    }

    case SET_SKILL_HISTORY: {
      return {
        ...state,
        skillHistory: action.payload,
      };
    }

    case SET_ADD_SKILL_BTN: {
      return {
        ...state,
        addSkillBtn: action.payload,
      };
    }

    case SET_CLEAR_SAVE_BTN: {
      return {
        ...state,
        clearSaveBtn: action.payload,
      };
    }

    case ENABLE_EDIT: {
      return {
        ...state,
        isEditEnabled: action.payload,
      };
    }

    case SET_ADD_SKILL_DIALOG: {
      return {
        ...state,
        addSkillDialog: action.payload,
      };
    }

    case SET_SKILL_HISTORY_DIALOG: {
      return {
        ...state,
        skillHistoryDialog: action.payload,
      };
    }

    case CLEAR_INFO: {
      return {
        ...initialState,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;

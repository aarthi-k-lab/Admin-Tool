/* eslint-disable import/prefer-default-export */
import {
  takeEvery,
  all,
  select,
  call,
  put,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import * as R from 'ramda';
import selectors from './selectors';
import { selectors as loginSelectors } from '../login';
import {
  FETCH_USERS,
  SET_USERS,
  FETCH_EVENTS,
  SET_EVENTS,
  FETCH_SKILLS,
  SET_SKILLS,
  FETCH_USER_SKILLS,
  SET_USER_SKILLS,
  FETCH_SKILL_HISTORY,
  SET_SKILL_HISTORY,
  SAVE_UPDATE_USER_SKILLS,
  SAVE_SAGA_UPDATE_USER_SKILLS,
  ENABLE_EDIT,
} from './types';


const fetchUsers = function* fetchUsers() {
  try {
    const user = yield select(loginSelectors.getUser);
    const userEmail = R.path(['userDetails', 'email'], user);
    const name = R.path(['userDetails', 'name'], user).split(' ');

    const currentUser = {
      emailAddr: userEmail,
      userId: '',
      firstName: name[0],
      lastName: name[1],
      managerEmailAddr: '',
    };

    const userList = yield call(Api.callGet, `/api/dataservice/userskills/users/${userEmail}`);
    if (userList) {
      yield put({ type: SET_USERS, payload: [{ ...currentUser }].concat(userList) });
    }
  } catch (e) {
    yield put({ type: SET_USERS, payload: [] });
  }
};

const fetchEvents = function* fetchEvents() {
  try {
    const eventList = yield call(Api.callGet, '/api/dataservice/userskills/events');
    if (eventList) {
      yield put({ type: SET_EVENTS, payload: eventList });
    }
  } catch (e) {
    yield put({ type: SET_EVENTS, payload: [] });
  }
};

const fetchSkills = function* fetchSkills() {
  try {
    const { eventName } = yield select(selectors.getSelectedEvent);

    const skillList = yield call(Api.callGet, `/api/dataservice/userskills/skills/${eventName}`);
    if (skillList) {
      yield put({ type: SET_SKILLS, payload: skillList });
    }
  } catch (e) {
    yield put({ type: SET_SKILLS, payload: [] });
  }
};

const fetchUserSkills = function* fetchUserSkills() {
  try {
    const { emailAddr } = yield select(selectors.getSelectedUser);

    const { eventName } = yield select(selectors.getSelectedEvent);

    const userSkillList = yield call(Api.callGet, `/api/dataservice/userskills/${emailAddr}/${eventName}`);
    if (userSkillList) {
      yield put({ type: SET_USER_SKILLS, payload: userSkillList });
    }
  } catch (e) {
    yield put({ type: SET_USER_SKILLS, payload: [] });
  }
};

const saveUpdateUserSkills = function* saveUpdateUserSkills() {
  try {
    yield put({ type: ENABLE_EDIT, payload: false });

    const manager = yield select(loginSelectors.getUser);
    const managerEmailAddr = R.path(['userDetails', 'email'], manager);

    const newUserSkills = yield select(selectors.getNewUserSkills);
    const updatedUserSkills = yield select(selectors.getUpdatedUserSkills);

    let updatedUserSkillList;
    let newUserSkillList;

    if (updatedUserSkills.length === 0) {
      updatedUserSkillList = [];
    } else {
      updatedUserSkillList = yield call(Api.callPost, '/api/dataservice/userskills/update', { managerEmailAddr, userSkills: updatedUserSkills });

      if (!updatedUserSkillList) {
        updatedUserSkillList = [];
      }
    }

    if (newUserSkills.length === 0) {
      newUserSkillList = [];
    } else {
      newUserSkillList = yield call(Api.callPost, '/api/dataservice/userskills/add', { managerEmailAddr, userSkills: newUserSkills });

      if (newUserSkillList) {
        newUserSkillList = [];
      }
    }
    yield put({
      type: SAVE_SAGA_UPDATE_USER_SKILLS,
      payload: { updatedUserSkillList, newUserSkillList },
    });
  } catch (e) {
    yield put({ type: SAVE_SAGA_UPDATE_USER_SKILLS, payload: [] });
  }
};

const fetchSkillHistory = function* fetchSkillHistory(payload) {
  try {
    const skillHistoryList = yield call(Api.callGet, `/api/dataservice/userskills/history/${payload.payload}`);

    if (skillHistoryList) {
      yield put({ type: SET_SKILL_HISTORY, payload: skillHistoryList });
    }
  } catch (e) {
    yield put({ type: SET_SKILL_HISTORY, payload: [] });
  }
};

function* watchFetchUsers() {
  yield takeEvery(FETCH_USERS, fetchUsers);
}

function* watchFetchEvents() {
  yield takeEvery(FETCH_EVENTS, fetchEvents);
}

function* watchFetchSkills() {
  yield takeEvery(FETCH_SKILLS, fetchSkills);
}

function* watchFetchUserSkills() {
  yield takeEvery(FETCH_USER_SKILLS, fetchUserSkills);
}

function* watchSaveUpdateUserSkills() {
  yield takeEvery(SAVE_UPDATE_USER_SKILLS, saveUpdateUserSkills);
}

function* watchFetchSkillHistory() {
  yield takeEvery(FETCH_SKILL_HISTORY, fetchSkillHistory);
}

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchFetchUsers(),
    watchFetchEvents(),
    watchFetchSkills(),
    watchFetchUserSkills(),
    watchSaveUpdateUserSkills(),
    watchFetchSkillHistory(),
  ]);
};

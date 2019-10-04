import {
  take,
  all,
  call,
  put,
} from 'redux-saga/effects';
import {
  SET_USER_SCHEMA_SAGA, SET_USER_SCHEMA_SUCCESS, SET_USER_SCHEMA_FAILED, SET_USER_ROLE,
} from './types';

const setUserSchema = function* setUserSchema(payload) {
  try {
    yield put({
      type: SET_USER_SCHEMA_SUCCESS,
      payload: payload.payload,
    });
  } catch (e) {
    yield put({
      type: SET_USER_SCHEMA_FAILED,
      payload: {},
    });
  }
};

const setUserRole = function* setUserRole(payload) {
  yield put({
    type: SET_USER_ROLE,
    payload: payload.payload,
  });
};

function* watchSetUserRole() {
  const payload = yield take(SET_USER_ROLE);
  if (payload != null) {
    yield call(setUserRole, payload);
  }
}

function* watchSetUserSchema() {
  try {
    const payload = yield take(SET_USER_SCHEMA_SAGA);
    if (payload != null) {
      yield call(setUserSchema, payload);
    }
  } catch (e) {
    yield put({
      type: SET_USER_SCHEMA_FAILED,
      payload: {},
    });
  }
}


export const TestExports = {
  setUserSchema,
  watchSetUserSchema,
};

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchSetUserSchema(),
    watchSetUserRole(),
  ]);
};

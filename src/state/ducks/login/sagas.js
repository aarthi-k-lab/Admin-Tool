import {
  take,
  all,
  put,
} from 'redux-saga/effects';
import { SET_USER_SCHEMA_SAGA, SET_USER_SCHEMA_SUCCESS, SET_USER_SCHEMA_FAILED } from './types';

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

function* watchSetUserSchema() {
  try {
    let payload = yield take(SET_USER_SCHEMA_SAGA);
    if (payload != null) {
      payload = yield setUserSchema(payload);
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
  ]);
};

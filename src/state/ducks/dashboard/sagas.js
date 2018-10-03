import {
  take,
  all,
  fork,
  put,
} from 'redux-saga/effects';
import { SET_EXPAND_VIEW, SET_EXPAND_VIEW_SAGA } from './types';

const setExpandView = function* setUserSchema() {
  yield put({
    type: SET_EXPAND_VIEW,
  });
};

function* watchSetExpandView() {
  while ((yield take(SET_EXPAND_VIEW_SAGA)) !== null) {
    yield fork(setExpandView);
  }
}

export const TestExports = {
  setExpandView,
};

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchSetExpandView(),
  ]);
};

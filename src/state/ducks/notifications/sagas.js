import {
  takeEvery,
  all,
  put,
} from 'redux-saga/effects';
import { SET_SNACK_BAR_VALUES, SET_SNACK_BAR_VALUES_SAGA } from './types';

const setSnackBarStates = function* setSnackBarStates(payload) {
  try {
    yield put({
      type: SET_SNACK_BAR_VALUES,
      payload: payload.payload,
    });
  } catch (e) {
    yield put({
      type: SET_SNACK_BAR_VALUES,
      payload: {},
    });
  }
};

function* watchSnackBarStateChange() {
  yield takeEvery(SET_SNACK_BAR_VALUES_SAGA, setSnackBarStates);
}

export const TestExports = {
  watchSnackBarStateChange,
  setSnackBarStates,
};

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchSnackBarStateChange(),
  ]);
};

import {
  takeEvery,
  all,
  call,
  put,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import {
  GET_CHECKLIST_SAGA,
  GET_TASKS_SAGA,
  STORE_CHECKLIST,
  STORE_TASKS,
} from './types';
import {
  SET_SNACK_BAR_VALUES,
} from '../notifications/types';

function* getChecklist(action) {
  try {
    // eslint-disable-next-line
    const { payload: { taskId } } = action;
    const response = yield call(Api.callGet, `/api/task-engine/task/${taskId}?depth=2`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    yield put({
      type: STORE_CHECKLIST,
      payload: response,
    });
  } catch (e) {
    const snackBar = {
      message: 'Checklist fetch failed.',
      type: 'error',
      open: true,
    };
    yield put({
      type: SET_SNACK_BAR_VALUES,
      payload: snackBar,
    });
  }
}

function* getTasks(action) {
  try {
    // eslint-disable-next-line
    const { payload: { taskId, depth } } = action;
    const response = yield call(Api.callGet, `/api/task-engine/task/${'5c6fd9ba925e7e0daf399dd1'}?depth=${depth}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    yield put({
      type: STORE_TASKS,
      payload: response,
    });
  } catch (e) {
    const snackBar = {};
    snackBar.message = 'Task/s fetch failed.';
    snackBar.type = 'error';
    snackBar.open = true;
    yield put({
      type: SET_SNACK_BAR_VALUES,
      payload: snackBar,
    });
  }
}

function* watchGetChecklist() {
  yield takeEvery(GET_CHECKLIST_SAGA, getChecklist);
}

function* watchGetTasks() {
  yield takeEvery(GET_TASKS_SAGA, getTasks);
}

export const TestExports = {
  watchGetTasks,
};

export function* combinedSaga() {
  yield all([
    watchGetChecklist(),
    watchGetTasks(),
  ]);
}

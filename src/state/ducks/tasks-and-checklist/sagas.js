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
  ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS,
  LOADING_CHECKLIST,
  LOADING_TASKS,
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
    yield put({
      type: LOADING_CHECKLIST,
    });
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
    yield put({
      type: ERROR_LOADING_CHECKLIST,
    });
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
    yield put({
      type: LOADING_TASKS,
    });
    const response = yield call(Api.callGet, `/api/task-engine/task/${'5c7686abd41e60431a7fc578'}?depth=${depth}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    yield put({
      type: STORE_TASKS,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: ERROR_LOADING_TASKS,
    });
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

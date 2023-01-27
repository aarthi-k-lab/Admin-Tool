import {
  select,
  takeLatest,
  takeEvery,
  all,
  call,
  put,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import * as R from 'ramda';
import { selectors as dashboardSelectors } from 'ducks/dashboard/index';
import { actions as tombStoneActions } from 'ducks/tombstone/index';
import { ALL_MILESTONE_HISTORY } from '../../../constants/auditView';
import {
  LOAD_MLSTN_SAGA,
  LOAD_MLSTN_RESULT,
  GET_TASKS_SAGA,
  GET_TASKS_RESULT,

  GET_STATUS_SAGA,
  GET_STATUS_RESULT,
  CLEAR_TASK_SAGA,
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_LOADER_TASK,
  HIDE_LOADER_TASK,
  GET_TASKS_DETAILS,
  STORE_TASKS_DETAILS,
  STORE_MLSTN_NAME,
  GET_STAGER_TASKS,
  STORE_STAGER_TASKS,
  GO_BACK_TO_SEARCH,
} from './types';

function* clearTasks() {
  yield put({
    type: GET_TASKS_RESULT,
    payload: [],
  });
}


function* getTaskDetails(payload) {
  try {
    const mlstnNm = payload.payload;
    const processId = yield select(dashboardSelectors.processId);
    const response = yield call(Api.callGet, `/api/bpm-audit/loanactivity/taskDetails/${processId}`);
    if (response) {
      if (R.equals(mlstnNm, ALL_MILESTONE_HISTORY)) {
        yield put({
          type: STORE_TASKS_DETAILS,
          payload: response,
        });
      } else {
        yield put({
          type: STORE_TASKS_DETAILS,
          payload: R.filter(obj => obj.mlstNm === mlstnNm, response),
        });
      }
    } else {
      yield put({
        type: STORE_TASKS_DETAILS,
        payload: [],
      });
    }
    yield put({
      type: STORE_MLSTN_NAME,
      payload: mlstnNm,
    });
  } catch (e) {
    yield put({ type: STORE_TASKS_DETAILS, payload: {} });
  }
}


function* loadMlstnBpm(payload) {
  const prcsId = payload.payload;
  try {
    yield put({ type: SHOW_LOADER });
    const response = yield call(Api.callGet, `/api/bpm-audit/loanactivity/applmlstnTasks/${prcsId}`);
    if (response) {
      yield put({
        type: LOAD_MLSTN_RESULT,
        payload: response,
      });
      yield put({
        type: GET_TASKS_RESULT,
        payload: [],
      });
      if (!R.isEmpty(response)) {
        yield call(getTaskDetails, { payload: R.head(response).mlstnNm });
      }
    } else {
      yield put({
        type: LOAD_MLSTN_RESULT,
        payload: { statusCode: 404 },
      });
    }
  } catch (e) {
    yield put({ type: LOAD_MLSTN_RESULT, payload: { e, valid: false } });
  }
  yield put({ type: HIDE_LOADER });
}

function* getTasksByTaskCategory(payload) {
  try {
    const parameters = R.propOr({}, 'payload', payload);
    const prcsId = R.propOr('', 'prcsId', parameters);
    const taskCategory = R.propOr('', 'taskCategory', parameters);
    const creDttmMin = R.propOr({}, 'creDttmMin', parameters);
    const creDttmMax = R.propOr({}, 'creDttmMax', parameters);
    yield put({ type: SHOW_LOADER_TASK });
    const response = yield call(Api.callGet, `/api/bpm-audit/loanactivity/byprocessidtaskcateganddate/${prcsId}/${taskCategory}/${creDttmMin}/${creDttmMax}`);
    if (response) {
      yield put({
        type: GET_TASKS_RESULT,
        payload: response,
      });
    } else {
      yield put({
        type: GET_TASKS_RESULT,
        payload: { statusCode: 404 },
      });
    }
    yield put({ type: HIDE_LOADER_TASK });
  } catch (e) {
    yield put({ type: GET_TASKS_RESULT, payload: { e, valid: false } });
  }
}

function* getStatusByTasks(payload) {
  try {
    const idTask = payload.payload;
    yield put({ type: SHOW_LOADER });
    const response = yield call(Api.callGet, `/api/bpm-audit/loanactivity/status/task/${idTask}`);
    if (response) {
      yield put({
        type: GET_STATUS_RESULT,
        payload: response,
      });
    } else {
      yield put({
        type: GET_STATUS_RESULT,
        payload: { statusCode: 404 },
      });
    }
  } catch (e) {
    yield put({ type: GET_STATUS_RESULT, payload: { e, valid: false } });
  }
  yield put({ type: HIDE_LOADER });
}

function* getStagerTasks(payload) {
  try {
    const {
      mlstnNm, minCreDttm, maxDttm, prcsId,
    } = payload.payload;
    const key = `${minCreDttm}+${maxDttm}`;
    const response = yield call(Api.callGet, `/api/bpm-audit/loanactivity/stagerTasks/${prcsId}/${minCreDttm}/${maxDttm}/${mlstnNm}`);
    if (response) {
      yield put({
        type: STORE_STAGER_TASKS,
        payload: { response, key },
      });
    } else {
      yield put({
        type: STORE_STAGER_TASKS,
        payload: {},
      });
    }
  } catch (e) {
    yield put({ type: STORE_STAGER_TASKS, payload: {} });
  }
}

function* fetchTombstonedDataOnGoBackToSearch() {
  yield put(tombStoneActions.fetchTombstoneData());
}

function* watchLoadMlstn() {
  yield takeLatest(LOAD_MLSTN_SAGA, loadMlstnBpm);
}

function* watchGetTasksByTaskCategory() {
  yield takeEvery(GET_TASKS_SAGA, getTasksByTaskCategory);
}

function* watchGetStatusByTasks() {
  yield takeEvery(GET_STATUS_SAGA, getStatusByTasks);
}

function* watchClearTasks() {
  yield takeLatest(CLEAR_TASK_SAGA, clearTasks);
}

function* watchGetTaskDetails() {
  yield takeEvery(GET_TASKS_DETAILS, getTaskDetails);
}

function* watchGetStagerTasks() {
  yield takeEvery(GET_STAGER_TASKS, getStagerTasks);
}

function* watchGoBackToSearch() {
  yield takeEvery(GO_BACK_TO_SEARCH, fetchTombstonedDataOnGoBackToSearch);
}

export const TestExports = {
  watchLoadMlstn,
  watchGetTasksByTaskCategory,
  watchGetStatusByTasks,
  watchGetStagerTasks,
};

export function* combinedSaga() {
  yield all([
    watchLoadMlstn(),
    watchGetTasksByTaskCategory(),
    watchGetStatusByTasks(),
    watchClearTasks(),
    watchGetTaskDetails(),
    watchGetStagerTasks(),
    watchGoBackToSearch(),
  ]);
}

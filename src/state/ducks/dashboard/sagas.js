import {
  select,
  take,
  takeEvery,
  all,
  call,
  fork,
  put,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import { actions as tombstoneActions } from 'ducks/tombstone/index';
import { selectors as loginSelectors } from 'ducks/login/index';
import selectors from './selectors';
import {
  CLEAR_DISPOSITION,
  END_SHIFT,
  GET_NEXT,
  SET_EXPAND_VIEW,
  SET_EXPAND_VIEW_SAGA,
  SAVE_DISPOSITION_SAGA,
  SAVE_DISPOSITION,
  SAVE_EVALID_LOANNUMBER,
  SUCCESS_END_SHIFT,
  SHOW_LOADER,
  SHOW_SAVING_LOADER,
  HIDE_LOADER,
  HIDE_SAVING_LOADER,
  TASKS_NOT_FOUND,
  TASKS_FETCH_ERROR,
  AUTO_SAVE_OPERATIONS,
  AUTO_SAVE_TRIGGER,
} from './types';
import { errorTombstoneFetch } from './actions';


const setExpandView = function* setExpand() {
  yield put({
    type: SET_EXPAND_VIEW,
  });
};

function* watchSetExpandView() {
  while ((yield take(SET_EXPAND_VIEW_SAGA)) !== null) {
    yield fork(setExpandView);
  }
}

const autoSaveOnClose = function* autoSaveOnClose() {
  /* todo : call to service to autosave disposition in db */
  yield put({
    type: AUTO_SAVE_OPERATIONS,
  });
};

function* watchAutoSave() {
  yield takeEvery(AUTO_SAVE_TRIGGER, autoSaveOnClose);
}

const saveDisposition = function* setDiposition(dispositionPayload) {
  try {
    yield put({ type: SHOW_SAVING_LOADER });
    const disposition = R.propOr({}, 'payload', dispositionPayload);
    const evalId = yield select(selectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const taskId = yield select(selectors.taskId);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const response = yield call(Api.callPost, `/api/disposition/disposition?evalCaseId=${evalId}&disposition=${disposition}&assignedTo=${userPrincipalName}&taskId=${taskId}`, {});
    yield put({
      type: SAVE_DISPOSITION,
      payload: response,
    });
    yield put({ type: HIDE_SAVING_LOADER });
  } catch (e) {
    console.log(e);
    yield put({ type: HIDE_SAVING_LOADER });
  }
};

function* watchDispositionSave() {
  let payload;
  while (true) {
    payload = yield take(SAVE_DISPOSITION_SAGA);
    if (payload) {
      yield fork(saveDisposition, payload);
    }
  }
}

function getLoanNumber(taskDetails) {
  return R.path(['taskData', 'data', 'loanNumber'], taskDetails);
}

function getEvalPayload(taskDetails) {
  const loanNumber = getLoanNumber(taskDetails);
  const evalId = R.path(['taskData', 'data', 'applicationId'], taskDetails);
  const taskId = R.path(['taskData', 'data', 'id'], taskDetails);
  return { loanNumber, evalId, taskId };
}
// eslint-disable-next-line
function* getNext(action) {

  try {
    yield put({ type: SHOW_LOADER });
    const appGroupName = 'FEUW';
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const taskDetails = yield call(Api.callGet, `api/workassign/getNext?appGroupName=${appGroupName}&userPrincipalName=${userPrincipalName}`);
    if (!R.isNil(R.path(['taskData', 'data'], taskDetails))) {
      const loanNumber = getLoanNumber(taskDetails);
      const evalPayload = getEvalPayload(taskDetails);
      console.log('evalPayload', evalPayload);
      yield put({ type: SAVE_EVALID_LOANNUMBER, payload: evalPayload });
      yield put(tombstoneActions.fetchTombstoneData(loanNumber));
      yield put({ type: HIDE_LOADER });
    } else if (!R.isNil(R.path(['messsage'], taskDetails))) {
      yield put({ type: TASKS_NOT_FOUND, payload: { notasksFound: true } });
      yield put(errorTombstoneFetch());
    } else {
      yield put({ type: TASKS_FETCH_ERROR, payload: { taskfetchError: true } });
      yield put(errorTombstoneFetch());
    }
    yield put({ type: HIDE_LOADER });
  } catch (e) {
    console.log(e);
    yield put({ type: TASKS_FETCH_ERROR, payload: { taskfetchError: true } });
    yield put(errorTombstoneFetch());
    yield put({ type: HIDE_LOADER });
  }
}

function* watchGetNext() {
  yield takeEvery(GET_NEXT, getNext);
}

// eslint-disable-next-line
function* endShift(action) {
  yield put({ type: SUCCESS_END_SHIFT });
  yield put({ type: CLEAR_DISPOSITION });
}

function* watchEndShift() {
  yield takeEvery(END_SHIFT, endShift);
}
export const TestExports = {
  autoSaveOnClose,
  endShift,
  saveDisposition,
  setExpandView,
  watchAutoSave,
  watchEndShift,
  watchSetExpandView,
  watchGetNext,
  getNext,
  watchDispositionSave,
};

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchAutoSave(),
    watchDispositionSave(),
    watchGetNext(),
    watchSetExpandView(),
    watchEndShift(),
  ]);
};

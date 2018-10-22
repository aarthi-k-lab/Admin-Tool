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
  TASKS_NOT_FOUND,
  AUTO_SAVE_OPERATIONS,
  AUTO_SAVE_TRIGGER,
} from './types';


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
  const disposition = R.propOr({}, 'payload', dispositionPayload);
  const evalId = yield select(selectors.evalId);
  const user = yield select(loginSelectors.getUser);
  const taskId = yield select(selectors.taskId);
  // const taskId = 1161415;
  const userPrincipalName = R.path(['userDetails', 'email'], user);
  const response = yield call(Api.callPost, `/api/disposition/disposition?evalCaseId=${evalId}&disposition=${disposition}&assignedTo=${userPrincipalName}&taskId=${taskId}`, {});
  yield put({
    type: SAVE_DISPOSITION,
    payload: response,
  });
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

// eslint-disable-next-line
function* getNext(action) {
  /*
    Call the endpoint for get next -> Response contains evalId, loanNumber, etc
    -> Use loanNumber to dispatch an action which fetches loanInformation
  */
  const appGroupName = 'FEUW';
  const user = yield select(loginSelectors.getUser);
  const userPrincipalName = R.path(['userDetails', 'email'], user);
  const taskDetails = yield call(Api.callGet, `api/workassign/getNext?appGroupName=${appGroupName}&userPrincipalName=${userPrincipalName}`);
  // const taskId = 1161415;
  if (!R.isNil(R.path(['taskData', 'data'], taskDetails))) {
    const loanNumber = R.path(['taskData', 'data', 'loanNumber'], taskDetails); // R.path(['payload', 'loanNumber'], action);
    const evalId = R.path(['taskData', 'data', 'applicationId'], taskDetails);
    const taskId = R.path(['taskData', 'data', 'id'], taskDetails);
    yield put({ type: SAVE_EVALID_LOANNUMBER, payload: { loanNumber, evalId, taskId } });
    yield put(tombstoneActions.fetchTombstoneData(loanNumber));
    yield put({ type: TASKS_NOT_FOUND, payload: { notasksFound: false } });
  } else {
    yield put({ type: TASKS_NOT_FOUND, payload: { notasksFound: true } });
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

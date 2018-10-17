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
import selectors from './selectors';
import {
  GET_NEXT,
  SET_EXPAND_VIEW,
  SET_EXPAND_VIEW_SAGA,
  SAVE_DISPOSITION_SAGA,
  SAVE_DISPOSITION,
  SAVE_EVALID_LOANNUMBER,
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
  const response = yield call(Api.callPost, `/api/disposition/disposition?evalCaseId=${evalId}&disposition=${disposition}`, {});
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
  const loanNumber = 596400243; // R.path(['payload', 'loanNumber'], action);
  const evalId = 1883281;
  yield put({ type: SAVE_EVALID_LOANNUMBER, payload: { loanNumber, evalId } });
  yield put(tombstoneActions.fetchTombstoneData(loanNumber));
}

function* watchGetNext() {
  yield takeEvery(GET_NEXT, getNext);
}

export const TestExports = {
  autoSaveOnClose,
  saveDisposition,
  setExpandView,
  watchAutoSave,
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
  ]);
};

import {
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
import {
  GET_NEXT,
  SET_EXPAND_VIEW,
  SET_EXPAND_VIEW_SAGA,
  SAVE_DISPOSITION_SAGA,
  SAVE_DISPOSITION,
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

const saveDisposition = function* setDiposition(dispositionPayload) {
  const disposition = R.propOr({}, 'payload', dispositionPayload);
  const evalId = 1883281;
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
  yield put(tombstoneActions.fetchTombstoneData(loanNumber));
}

function* watchGetNext() {
  yield takeEvery(GET_NEXT, getNext);
}

export const TestExports = {
  saveDisposition,
  setExpandView,
};

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchDispositionSave(),
    watchGetNext(),
    watchSetExpandView(),
  ]);
};

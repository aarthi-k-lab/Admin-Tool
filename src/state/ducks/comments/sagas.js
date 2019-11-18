import {
  takeEvery,
  all,
  call,
  put,
  select,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import selectors from '../dashboard/selectors';
import {
  GET_COMMENTS_SAGA,
  GET_COMMENTS_RESULT,
  POST_COMMENT_SAGA,
} from './types';

import DashboardModel from '../../../models/Dashboard';

import { SET_SNACK_BAR_VALUES_SAGA } from '../notifications/types';

function getGroup(group) {
  return group === DashboardModel.ALL_STAGER ? DashboardModel.POSTMODSTAGER : group;
}

function* fireSnackBar(snackBarData) {
  yield put({
    type: SET_SNACK_BAR_VALUES_SAGA,
    payload: snackBarData,
  });
}

function* getComments(payload) {
  try {
    const req = payload.payload;
    const newPayload = yield call(Api.callGet, `/api/utility/comment?applicationName=${req.applicationName}&loanNumber=${req.loanNumber}&processId=${req.processId}&processIdType=${req.processIdType}`);
    if (newPayload != null) {
      yield put({
        type: GET_COMMENTS_RESULT,
        payload: newPayload,
      });
    }
  } catch (e) {
    yield put({
      type: GET_COMMENTS_RESULT,
      payload: {},
    });
  }
}

function* postComment(payload) {
  try {
    const response = yield call(Api.callPost, '/api/utility/comment', payload.payload);
    const groupName = yield select(selectors.groupName);
    const group = getGroup(groupName);
    if (group !== DashboardModel.POSTMODSTAGER) {
      if (!response) {
        const snackBarData = {};
        snackBarData.message = 'Something went wrong!!';
        snackBarData.type = 'error';
        snackBarData.open = true;
        yield call(fireSnackBar, snackBarData);
      } else {
        const snackBarData = {};
        snackBarData.message = 'Created Successfully!';
        snackBarData.type = 'success';
        snackBarData.open = true;
        yield call(fireSnackBar, snackBarData);
        yield call(getComments, payload);
      }
    }
  } catch (e) {
    const snackBarData = {};
    snackBarData.message = 'Something went wrong!!';
    snackBarData.type = 'error';
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
}


function* watchGetComments() {
  yield takeEvery(GET_COMMENTS_SAGA, getComments);
}

function* watchPostComment() {
  yield takeEvery(POST_COMMENT_SAGA, postComment);
}

export const TestExports = {
  watchGetComments,
  watchPostComment,
  getComments,
  postComment,
  fireSnackBar,
};

export function* combinedSaga() {
  yield all([
    watchGetComments(),
    watchPostComment(),
  ]);
}

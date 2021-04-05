import {
  takeEvery,
  all,
  call,
  put,
  select,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import { ERROR, SUCCESS } from 'constants/common';
import selectors from '../dashboard/selectors';
import {
  GET_COMMENTS_SAGA,
  GET_SEARCH_AREA,
  POST_COMMENT_SAGA,
  GET_EVALCOMMENTS_SAGA,
  GET_EVALCOMMENTS_RESULT,
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
    let newPayload = [];
    const loanNumber = yield select(selectors.loanNumber);
    const { searchArea } = req;
    yield put({
      type: GET_SEARCH_AREA,
      payload: searchArea,
    });
    newPayload = yield call(Api.callGet, `/api/utility/byLoan?loanId=${loanNumber}`);
    if (newPayload) {
      yield put({
        type: GET_EVALCOMMENTS_RESULT,
        payload: { comments: newPayload },
      });
    }
  } catch (e) {
    yield put({
      type: GET_EVALCOMMENTS_RESULT,
      payload: {},
    });
  }
}

function* getCommentsForEvals(payload) {
  try {
    const { loanNumber } = payload.payload;
    const newPayload = yield call(Api.callGet, `/api/utility/byLoan?loanId=${loanNumber}`);
    if (newPayload) {
      yield put({
        type: GET_EVALCOMMENTS_RESULT,
        payload: {
          comments: newPayload,
        },
      });
    }
  } catch (e) {
    yield put({
      type: GET_EVALCOMMENTS_RESULT,
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
        snackBarData.type = ERROR;
        snackBarData.open = true;
        yield call(fireSnackBar, snackBarData);
      } else {
        const snackBarData = {};
        snackBarData.message = 'Created Successfully!';
        snackBarData.type = SUCCESS;
        snackBarData.open = true;
        yield call(fireSnackBar, snackBarData);
        yield call(getComments, payload);
      }
    }
  } catch (e) {
    const snackBarData = {};
    snackBarData.message = 'Something went wrong!!';
    snackBarData.type = ERROR;
    snackBarData.open = true;
    yield call(fireSnackBar, snackBarData);
  }
}


function* watchGetComments() {
  yield takeEvery(GET_COMMENTS_SAGA, getComments);
}

function* watchGetCommentsByEval() {
  yield takeEvery(GET_EVALCOMMENTS_SAGA, getCommentsForEvals);
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
    watchGetCommentsByEval(),
  ]);
}

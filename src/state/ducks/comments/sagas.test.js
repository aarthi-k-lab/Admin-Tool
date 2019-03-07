import {
  takeEvery, call, put,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import { TestExports } from './sagas';


import {
  GET_COMMENTS_SAGA,
  GET_COMMENTS_RESULT,
  POST_COMMENT_SAGA,
} from './types';

describe('watch getComments ', () => {
  it('getComments should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchGetComments)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        GET_COMMENTS_SAGA,
        TestExports.getComments,
      ));
  });
});

describe('watch postComment ', () => {
  it('postComment should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchPostComment)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        POST_COMMENT_SAGA,
        TestExports.postComment,
      ));
  });
});

describe('get Comments', () => {
  const payload = {
    payload: {
      applicationName: 'CMOD',
      processIdType: 'EvalID',
      processId: 47898,
      eventName: 'UW',
      loanNumber: 34473856,
    },
  };
  const response = {
    comments: [
      {
        content: 'comment1',
      },
    ],
  };
  const saga = cloneableGenerator(TestExports.getComments)(payload);
  it('call comments Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callGet, '/api/utility/comment?applicationName=CMOD&loanNumber=34473856&processId=47898&processIdType=EvalID'));
  });

  it('should trigger get comments result action', () => {
    expect(saga.next(response).value)
      .toEqual(put({
        type: GET_COMMENTS_RESULT,
        payload: response,
      }));
  });
});

describe('post Comment', () => {
  const payload = {
    payload: {
      applicationName: 'CMOD',
      processIdType: 'EvalID',
      processId: 47898,
      eventName: 'UW',
      loanNumber: 34473856,
      content: 'comment1',
    },
  };
  const response = {
    comments: [
      {
        content: 'comment1',
      },
    ],
  };

  const snackBarData = {};
  snackBarData.message = 'Created Successfully!';
  snackBarData.type = 'success';
  snackBarData.open = true;

  const saga = cloneableGenerator(TestExports.postComment)(payload);
  it('call comments Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, '/api/utility/comment', payload.payload));
  });

  it('should call firesnackbar ', () => {
    expect(saga.next(response).value)
      .toEqual(call(TestExports.fireSnackBar, snackBarData));
  });

  it('should call getComments ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.getComments, payload));
  });
});

import {
  takeEvery, call, put, select,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import { TestExports } from './sagas';
import selectors from '../dashboard/selectors';


import {
  GET_COMMENTS_SAGA,
  POST_COMMENT_SAGA,
  GET_SEARCH_AREA,
  GET_EVALCOMMENTS_RESULT,
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
      processIdType: 'WF_PRCS_ID',
      processId: 47898,
      eventName: 'UW',
      loanNumber: 34473856,
      searchArea: false,
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
  const loanNumber = '34473856';
  it('should get loannumber', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.loanNumber));
  });

  it('should trigger get comments result action', () => {
    expect(saga.next(loanNumber).value)
      .toEqual(put({
        type: GET_SEARCH_AREA,
        payload: false,
      }));
  });

  it('call comments Api', () => {
    expect(saga.next(payload).value)
      .toEqual(call(Api.callGet, '/api/utility/byLoan?loanId=34473856'));
  });

  it('should trigger get comments result action', () => {
    expect(saga.next(response).value)
      .toEqual(put({
        type: GET_EVALCOMMENTS_RESULT,
        payload: { comments: response },
      }));
  });
});

describe('post Comment', () => {
  const payload = {
    payload: {
      applicationName: 'CMOD',
      processIdType: 'WF_PRCS_ID',
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

  it('should get user group name', () => {
    expect(saga.next(response).value)
      .toEqual(select(selectors.groupName));
  });

  it('should call firesnackbar ', () => {
    expect(saga.next('FEUW').value)
      .toEqual(call(TestExports.fireSnackBar, snackBarData));
  });

  it('should call getComments ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.getComments, payload));
  });
});

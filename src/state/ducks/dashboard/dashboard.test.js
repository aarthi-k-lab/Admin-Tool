import { put, call, takeEvery, take, fork } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import * as actionTypes from './types';
import { onExpandView, dispositionSave, clearDisposition, clearFirstVisit } from './actions';
import { TestExports } from './sagas';

describe('expand view ', () => {
  it('should toggle expandView State', () => {
    const saga = cloneableGenerator(TestExports.setExpandView)();
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.SET_EXPAND_VIEW,
        payload: undefined,
      }));
  });
});

describe('watch getnext ', () => {
  it('should trigger getnext worker', () => {
    const saga = cloneableGenerator(TestExports.watchGetNext)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.GET_NEXT,TestExports.getNext));
  });
});

describe('getnext ', () => {
  it('getnext worker should trigger fetchtombstone action', () => {
    const saga = cloneableGenerator(TestExports.getNext)();
    const actionDispatched = {
        "payload":  {
            "loanNumber": 596400243,
         },
          "type": "app/tombstone/FETCH_TOMBSTONE_DATA",
        };
    expect(saga.next().value)
      .toEqual(put(actionDispatched));
  });
});

describe('watch expandView ', () => {
  it('should trigger setexpandview worker', () => {
    const saga = cloneableGenerator(TestExports.watchSetExpandView)();
    expect(saga.next().value)
      .toEqual(take(actionTypes.SET_EXPAND_VIEW_SAGA));
    expect(saga.next().value)
      .toEqual(fork(TestExports.setExpandView));
  });
});

describe('watch dispositionsave ', () => {
  it('should trigger savedisposition worker', () => {
    const saga = cloneableGenerator(TestExports.watchDispositionSave)();
    expect(saga.next().value)
      .toEqual(take(actionTypes.SAVE_DISPOSITION_SAGA,TestExports.saveDisposition));
    expect(saga.next('missingDocuments').value)
      .toEqual(fork(TestExports.saveDisposition,'missingDocuments'));
  });
});

describe('expand view ', () => {
  it('should trigger the SET_EXPAND action', () => {
    const response = onExpandView(actionTypes.SET_EXPAND_VIEW_SAGA);
    expect(response.type).toEqual(actionTypes.SET_EXPAND_VIEW_SAGA);
  });

  describe('saveDisposition ', () => {
    it('should trigger the SET_EXPAND action', () => {
      const response = dispositionSave(actionTypes.SAVE_DISPOSITION_SAGA);
      expect(response.type).toEqual(actionTypes.SAVE_DISPOSITION_SAGA);
    });
  });

  describe('clearDisposition ', () => {
    it('should trigger the SET_EXPAND action', () => {
      const response = clearDisposition();
      expect(response.type).toEqual(actionTypes.CLEAR_DISPOSITION);
    });
  });

  describe('clearFirstVisit ', () => {
    it('should trigger the SET_EXPAND action', () => {
      const response = clearFirstVisit();
      expect(response.type).toEqual(actionTypes.CLEAR_FIRST_VISIT);
    });
  });

  describe('saveDisposition saga ', () => {
    const dispositionPayload = {
      payload: 'missingDocs',
    };
    const mockResponse = {
      enableGetNext: true,
    };
    const saga = cloneableGenerator(TestExports.saveDisposition)(dispositionPayload);
    it('should call validation service', () => {
      expect(saga.next().value)
        .toEqual(call(Api.callPost,'/api/disposition/disposition?evalCaseId=1883281&disposition=missingDocs',{}));
    });
    it('should update getNextResponse state', () => {
      expect(saga.next(mockResponse).value)
        .toEqual(put({
          type: actionTypes.SAVE_DISPOSITION,
          payload: mockResponse,
        }));
    });
  });
});
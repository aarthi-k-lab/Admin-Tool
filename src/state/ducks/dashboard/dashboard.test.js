import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import * as actionTypes from './types';
import { onExpandView, dispositionSave } from './actions';
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

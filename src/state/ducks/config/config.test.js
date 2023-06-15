// import { put } from 'redux-saga/effects';
import { takeEvery, call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import * as actionTypes from './types';
import { fetchAppConfig } from './actions';
import { TestExports } from './sagas';
import {
  FETCHCONFIG_SAGA,
} from './types';


import {
  TOGGLE_AZURE_SEARCH,
} from '../stager/types';

describe('Config actions', () => {
  it('should trigger the APP_CONFIG action', () => {
    const response = fetchAppConfig();
    expect(response.type).toEqual(actionTypes.FETCHCONFIG_SAGA);
  });
  describe('watchGetConfig', () => {
    const saga = cloneableGenerator(TestExports.watchGetConfig)();
    it('should trigger getConfig', () => {
      expect(saga.next().value)
        .toEqual(takeEvery(FETCHCONFIG_SAGA, TestExports.getConfig));
    });
  });

  describe('sets proper config if data is passed', () => {
    const payload = {
      features: {
        taskPane: true,
      },
      hiddenRoutes: [
      ],
      powerBIConstants: {
      },
      pdfGeneratorUrl: {
      },
    };
    const saga = cloneableGenerator(TestExports.getConfig)(payload);
    it('should call config service', () => {
      expect(saga.next().value).toEqual(call(Api.callGet, 'api/config'));
    });
    it('should update config state', () => {
      expect(saga.next(payload).value).toEqual(put({
        type: actionTypes.TOGGLE_REPORTS,
        payload: true,
      }));
    });
    it('toggle azure search', () => {
      expect(saga.next(payload).value).toEqual(put({
        type: actionTypes.CONFIG_DATA_SUCCESS,
        payload,
      }));
    });
  });
});

// import { put } from 'redux-saga/effects';
import { take, call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import * as actionTypes from './types';
import fetchAppConfig from './actions';
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
    it('watchGetConfig should be triggereds', () => {
      expect(saga.next().value)
        .toEqual(take(FETCHCONFIG_SAGA));
    });
    it('getConfig should be triggered', () => {
      expect(saga.next({}).value)
        .toEqual(TestExports.getConfig({}));
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
        type: actionTypes.CONFIG_DATA_SUCCESS,
        payload,
      }));
    });
    it('toggle azure search', () => {
      expect(saga.next(payload).value).toEqual(put({
        type: TOGGLE_AZURE_SEARCH,
      }));
    });
  });
});

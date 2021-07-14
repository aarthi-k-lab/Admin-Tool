// import { put } from 'redux-saga/effects';
import { take, call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import * as actionTypes from './types';
import { fetchPowerBIConfig, fetchAppConfig, getFeaturesTrigger } from './actions';
import { TestExports } from './sagas';
import {
  POWER_BI_CONSTANTS_SAGA,
  POWER_BI_CONSTANTS,
  GET_FEATURES_SAGA,
  SET_FEATURES,
  TOGGLE_HIDDEN_ROUTE,
} from './types';


import {
  TOGGLE_AZURE_SEARCH,
} from '../stager/types';

describe('Config actions', () => {
  it('should trigger the POWERBI_CONSTANTS action', () => {
    const response = fetchPowerBIConfig();
    expect(response.type).toEqual(actionTypes.POWER_BI_CONSTANTS_SAGA);
  });

  it('should trigger the APP_CONFIG action', () => {
    const response = fetchAppConfig();
    expect(response.type).toEqual(actionTypes.FETCHCONFIG_SAGA);
  });

  it('should trigger the FETCHCONFIG_SAGA action', () => {
    const response = fetchAppConfig();
    expect(response.type).toEqual(actionTypes.FETCHCONFIG_SAGA);
  });

  it('should trigger the GET_FEATURES_SAGA action', () => {
    const response = getFeaturesTrigger();
    expect(response.type).toEqual(actionTypes.GET_FEATURES_SAGA);
  });

  it('watchFetchPowerBIConfig saga receives POWER_BI_CONSTANTS_SAGA dispatch', () => {
    const saga = TestExports.watchFetchPowerBIConfig({
      type: actionTypes.POWER_BI_CONSTANTS_SAGA,
    });
    const sagaValue = saga.next().value;
    expect(sagaValue).toEqual(take(actionTypes.POWER_BI_CONSTANTS_SAGA));
  });

  it('watchGetFeatures saga receives GET_FEATURES_SAGA dispatch', () => {
    const saga = TestExports.watchGetFeatures({
      type: actionTypes.GET_FEATURES_SAGA,
    });
    const sagaValue = saga.next().value;
    expect(sagaValue).toEqual(take(actionTypes.GET_FEATURES_SAGA));
  });

  describe('watchGetFeatures', () => {
    const saga = cloneableGenerator(TestExports.watchGetFeatures)();
    it('watchGetFeatures should be triggered', () => {
      expect(saga.next().value)
        .toEqual(take(GET_FEATURES_SAGA));
    });
    it('fetchFeatureConfig should be triggered', () => {
      expect(saga.next({}).value)
        .toEqual(TestExports.fetchFeatureConfig({}));
    });
  });

  describe('watchFetchPowerBiConfig', () => {
    const saga = cloneableGenerator(TestExports.watchFetchPowerBIConfig)();
    it('watchFetchPowerBIConfig should be triggered', () => {
      expect(saga.next().value)
        .toEqual(take(POWER_BI_CONSTANTS_SAGA));
    });
    it('fetchPowerBIConfig should be triggered', () => {
      expect(saga.next({}).value)
        .toEqual(TestExports.fetchPowerBIConfig({}));
    });
  });

  describe('sets proper powerBIConstants if data is passed', () => {
    const payload = {
      powerBIReports: {
        reportId: '12345',
        reportUrl: 'abc/xyz',
      },
    };
    const saga = cloneableGenerator(TestExports.fetchPowerBIConfig)(payload);
    it('should call config service', () => {
      expect(saga.next().value).toEqual(call(Api.callGet, 'api/config'));
    });
    it('should update powerBiconfig state', () => {
      expect(saga.next(payload).value).toEqual(put({
        type: actionTypes.POWER_BI_CONSTANTS,
        payload: payload.powerBIReports,
      }));
    });
  });

  describe('sets proper config features if data is passed', () => {
    const payload = {
      features: {
        taskPane: true,
      },
      hiddenRoutes: [
      ],
    };
    const saga = cloneableGenerator(TestExports.fetchFeatureConfig)(payload);
    it('should call config service', () => {
      expect(saga.next().value).toEqual(call(Api.callGet, 'api/config'));
    });
    it('toggle azure search', () => {
      expect(saga.next(payload).value).toEqual(put({
        type: TOGGLE_AZURE_SEARCH,
      }));
    });
    it('should update hideIcons state', () => {
      expect(saga.next(payload).value).toEqual(put({
        type: actionTypes.TOGGLE_HIDDEN_ROUTE,
        payload: payload.hiddenRoutes,
      }));
    });
    it('should update features state', () => {
      expect(saga.next(payload).value).toEqual(put({
        type: actionTypes.SET_FEATURES,
        payload: payload.features,
      }));
    });
  });
});

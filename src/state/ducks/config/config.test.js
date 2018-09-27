// import { put } from 'redux-saga/effects';
import { take, put, call } from 'redux-saga/effects';
import * as actionTypes from './types';
import { fetchPowerBIConfig, fetchAppConfig } from './actions';
import { TestExports } from './sagas';
import * as Api from 'lib/Api';

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

  it('watchFetchPowerBIConfig saga receives POWER_BI_CONSTANTS_SAGA dispatch', () => {
    const saga = TestExports.watchFetchPowerBIConfig({
      type: actionTypes.POWER_BI_CONSTANTS_SAGA,
    });
    const sagaValue = saga.next().value;
    expect(sagaValue).toEqual(take(actionTypes.POWER_BI_CONSTANTS_SAGA));
  });

  // it('sets proper powerBIConstants if data is passed', () => {
  //   const payload = {
  //     powerBIReports: {
  //       reportId: '12345',
  //       reportUrl: 'abc/xyz',
  //     },
  //   };
  //   window.fetch = () => {
  //     console.log('Executing mock fetch');
  //     return new Promise(resolve => resolve(payload));
  //   };
  //   const saga = TestExports.fetchPowerBIConfig(payload);
  //   expect(saga.next().value).toEqual(call(Api.callGet, 'api/config'));
  //   expect(saga.next().value).toEqual(put({
  //     type: actionTypes.POWER_BI_CONSTANTS,
  //     payload: payload.powerBIReports,
  //   }));
  // });
});

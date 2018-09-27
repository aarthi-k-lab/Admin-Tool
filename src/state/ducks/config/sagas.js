import {
  take,
  all,
  call,
  put,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import { POWER_BI_CONSTANTS_SAGA, POWER_BI_CONSTANTS } from './types';

export const fetchPowerBIConfig = function* fetchPowerBIConfig() {
  try {
    const newPayload = yield call(Api.callGet, 'api/config');
    if (newPayload != null) {
      const getPowerBIConstants = R.propOr({}, 'powerBIReports');
      const powerBIConstants = getPowerBIConstants(newPayload);
      yield put({
        type: POWER_BI_CONSTANTS,
        payload: powerBIConstants,
      });
    }
  } catch (e) {
    yield put({
      type: POWER_BI_CONSTANTS,
      payload: {},
    });
  }
};

function* watchFetchPowerBIConfig() {
  let payload = yield take(POWER_BI_CONSTANTS_SAGA);
  if (payload != null) {
    payload = yield fetchPowerBIConfig();
  }
}

export const TestExports = {
  watchFetchPowerBIConfig,
  fetchPowerBIConfig,
};

export function* combinedSaga() {
  yield all([
    watchFetchPowerBIConfig(),
  ]);
}

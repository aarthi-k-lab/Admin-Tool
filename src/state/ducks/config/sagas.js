import {
  take,
  all,
  call,
  put,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import {
  POWER_BI_CONSTANTS_SAGA,
  POWER_BI_CONSTANTS,
  GET_FEATURES_SAGA,
  SET_FEATURES,
  GET_PDFGENRATOR_URL,
} from './types';

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

function* getPdfGeneratorUrl() {
  try {
    const response = yield call(Api.callGet, 'api/config');
    const pdfUrl = R.pathOr({}, ['pdfGenerator', 'pdfGeneratorUrl'], response);
    if (pdfUrl != null) {
      yield put({
        type: GET_PDFGENRATOR_URL,
        payload: pdfUrl,
      });
    }
  } catch (e) {
    yield put({
      type: GET_PDFGENRATOR_URL,
      payload: '',
    });
  }
}

function* fetchFeatureConfig() {
  try {
    const newPayload = yield call(Api.callGet, 'api/config');
    if (newPayload != null) {
      const getFeatures = R.propOr({}, 'features');
      const features = getFeatures(newPayload);
      yield put({
        type: SET_FEATURES,
        payload: features,
      });
    }
  } catch (e) {
    yield put({
      type: SET_FEATURES,
      payload: {},
    });
  }
}

function* watchFetchPowerBIConfig() {
  let payload = yield take(POWER_BI_CONSTANTS_SAGA);
  if (payload != null) {
    payload = yield fetchPowerBIConfig();
  }
}

function* watchGetFeatures() {
  const payload = yield take(GET_FEATURES_SAGA);
  if (payload != null) {
    yield fetchFeatureConfig(payload);
  }
}

function* watchGetPdfGeneratorUrl() {
  const payload = yield take(GET_PDFGENRATOR_URL);
  if (payload != null) {
    yield getPdfGeneratorUrl();
  }
}
export const TestExports = {
  watchFetchPowerBIConfig,
  fetchPowerBIConfig,
  watchGetFeatures,
  fetchFeatureConfig,
};

export function* combinedSaga() {
  yield all([
    watchFetchPowerBIConfig(),
    watchGetFeatures(),
    watchGetPdfGeneratorUrl(),
  ]);
}

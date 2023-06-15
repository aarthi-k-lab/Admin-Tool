import {
  all,
  call,
  put,
  takeEvery,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import {
  TOGGLE_HIDDEN_ROUTE,
  TOGGLE_ICON,
  CONFIG_DATA_SUCCESS,
  CONFIG_DATA_FAILURE,
  FETCHCONFIG_SAGA,
  TOGGLE_REPORTS,
} from './types';

import {
  TOGGLE_AZURE_SEARCH,
} from '../stager/types';

function* getConfig() {
  try {
    const newPayload = yield call(Api.callGet, 'api/config');
    yield put({ type: TOGGLE_REPORTS, payload: true });
    if (newPayload != null) {
      const powerBIConstants = R.pathOr({}, ['powerBIReports'], newPayload);
      const pdfGeneratorUrl = R.pathOr({}, ['pdfGenerator', 'pdfGeneratorUrl'], newPayload);
      const features = R.pathOr({}, ['features'], newPayload);
      const hiddenRoutes = R.pathOr([], ['hiddenRoutes'], newPayload);
      const configData = {
        powerBIConstants,
        pdfGeneratorUrl,
        features,
        hiddenRoutes,
      };
      yield put({
        type: CONFIG_DATA_SUCCESS,
        payload: configData,
      });
      yield put({
        type: TOGGLE_AZURE_SEARCH,
        payload: R.prop('azureSearchToggle', features),
      });
    }
  } catch (e) {
    yield put({
      type: CONFIG_DATA_FAILURE,
      payload: {},
    });
  }
  yield put({ type: TOGGLE_REPORTS, payload: false });
}

function* fetchHiddenRoute() {
  const newPayload = yield call(Api.callGet, 'api/config');
  const getIconsList = R.propOr([], 'hiddenRoutes');
  const hiddenRoutes = getIconsList(newPayload);
  yield put({
    type: TOGGLE_HIDDEN_ROUTE,
    payload: hiddenRoutes,
  });
}

function* watchGetConfig() {
  yield takeEvery(FETCHCONFIG_SAGA, getConfig);
}

function* watchHiddenRoute() {
  yield takeEvery(TOGGLE_ICON, fetchHiddenRoute);
}

export const TestExports = {
  watchHiddenRoute,
  watchGetConfig,
  getConfig,
};

export function* combinedSaga() {
  yield all([
    watchGetConfig(),
  ]);
}

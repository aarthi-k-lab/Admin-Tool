import { all } from 'redux-saga/effects';
import { combinedSaga as configSaga } from './config/sagas';
import { combinedSaga as loginSaga } from './login/sagas';
import { combinedSaga as dashboardSaga } from './dashboard/sagas';


console.log('hot reload v2');

export default function* rootSaga() {
  yield all([
    configSaga(),
    loginSaga(),
    dashboardSaga(),
  ]);
}

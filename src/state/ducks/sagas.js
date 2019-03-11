import { all } from 'redux-saga/effects';
import { combinedSaga as configSaga } from './config/sagas';
import { combinedSaga as loginSaga } from './login/sagas';
import { combinedSaga as dashboardSaga } from './dashboard/sagas';
import { combinedSaga as tombstoneSaga } from './tombstone/sagas';
import { combinedSaga as stagerSaga } from './stager/sagas';
import { combinedSaga as notifSaga } from './notifications/sagas';
import { combinedSaga as tasksAndChecklistSaga } from './tasks-and-checklist/sagas';
import { combinedSaga as commentsSaga } from './comments/sagas';


export default function* rootSaga() {
  yield all([
    configSaga(),
    loginSaga(),
    dashboardSaga(),
    tombstoneSaga(),
    stagerSaga(),
    notifSaga(),
    tasksAndChecklistSaga(),
    commentsSaga(),
  ]);
}

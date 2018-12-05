import { combineReducers } from 'redux';
import { reducers as appConfig } from './config';
import { reducers as user } from './login';
import { reducers as dashboard } from './dashboard';
import { reducers as tombstone } from './tombstone';
import { reducers as stager } from './stager';
import { reducers as notifs } from './notifications';

const rootReducer = combineReducers({
  appConfig,
  dashboard,
  tombstone,
  user,
  stager,
  notifs,
});

export default rootReducer;

import { combineReducers } from 'redux';
import { reducers as appConfig } from './config';
import { reducers as user } from './login';
import { reducers as dashboard } from './dashboard';
import { reducers as tombstone } from './tombstone';

const rootReducer = combineReducers({
  appConfig,
  dashboard,
  tombstone,
  user,
});

export default rootReducer;

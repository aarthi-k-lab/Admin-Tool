import { combineReducers } from 'redux';
import { reducers as appConfig } from './config';
import { reducers as user } from './login';
import { reducers as dashboard } from './dashboard';

const rootReducer = combineReducers({
  appConfig,
  dashboard,
  user,
});

export default rootReducer;

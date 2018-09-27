import { combineReducers } from 'redux';
import { reducers as appConfig } from './config';
import { reducers as user } from './login';

const rootReducer = combineReducers({
  appConfig,
  user,
});

export default rootReducer;

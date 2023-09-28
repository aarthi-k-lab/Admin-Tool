import { combineReducers } from 'redux';
import { reducers as appConfig } from './config';
import { reducers as user } from './login';
import { reducers as dashboard } from './dashboard';
import { reducers as tombstone } from './tombstone';
import { reducers as stager } from './stager';
import { reducers as notifs } from './notifications';
import { reducers as tasksAndChecklist } from './tasks-and-checklist';
import { reducers as comments } from './comments';
import { reducers as incomeCalculator } from './income-calculator';
import { reducers as milestoneActivity } from './milestone-activity';
import { reducers as widgets } from './widgets';
import { reducers as lsamsNotes } from './lsams-notes';
import { reducers as documentChecklist } from './document-checklist';
import { reducers as userSkills } from './user-skills';
import { reducers as indexer } from './indexer';

const rootReducer = combineReducers({
  appConfig,
  dashboard,
  tombstone,
  user,
  stager,
  notifs,
  tasksAndChecklist,
  comments,
  incomeCalculator,
  milestoneActivity,
  widgets,
  lsamsNotes,
  documentChecklist,
  userSkills,
  indexer,
});

export default rootReducer;

import * as R from 'ramda';

const getLoaderInfo = state => state.milestoneActivity.loading;
const getMlstnData = state => (state.milestoneActivity.groupTask
  ? state.milestoneActivity.groupTask : []);
const getStagerTasksData = state => (state.milestoneActivity.stagerTasks
  ? state.milestoneActivity.stagerTasks : []);
const getMlstnName = state => (state.milestoneActivity.mlstnName
  ? state.milestoneActivity.mlstnName : '');
const getTaskDetails = state => (state.milestoneActivity.taskDetails
  ? state.milestoneActivity.taskDetails : []);
const getTasksData = state => (state.milestoneActivity.tasks
  ? state.milestoneActivity.tasks : []);
const getStatusesData = state => (state.milestoneActivity.statuses
  ? state.milestoneActivity.statuses : []);
const inProgress = state => R.pathOr(false, ['bpm', 'inProgress'], state);
const inProgressTask = state => R.pathOr(false, ['bpm', 'inProgressTask'], state);

const selectors = {
  getLoaderInfo,
  getMlstnData,
  getTasksData,
  getStatusesData,
  inProgress,
  inProgressTask,
  getTaskDetails,
  getMlstnName,
  getStagerTasksData,
};

export default selectors;

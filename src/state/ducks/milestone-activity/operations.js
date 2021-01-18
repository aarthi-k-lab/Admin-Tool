import {
  loadMlstnAction,
  getTasksByTaskCategoryAction,
  clearTasksAction,
  getTaskDetails,
  getStagerTasks,
  clearMlstnData,
} from './actions';

const loadMlstn = dispatch => prcsId => dispatch(loadMlstnAction(prcsId));

const getTasksByTaskCategory = dispatch => payload => dispatch(
  getTasksByTaskCategoryAction(payload),
);

const clearTasks = dispatch => () => dispatch(
  clearTasksAction(),
);

const getTaskDetailsByTaskNm = dispatch => prcsId => dispatch(getTaskDetails(prcsId));

const getStagerTasksByDttm = dispatch => obj => dispatch(getStagerTasks(obj));

const clearMlstnDatas = dispatch => () => dispatch(
  clearMlstnData(),
);

const operations = {
  loadMlstn,
  getTasksByTaskCategory,
  clearTasks,
  getTaskDetailsByTaskNm,
  getStagerTasksByDttm,
  clearMlstnDatas,
};

export default operations;

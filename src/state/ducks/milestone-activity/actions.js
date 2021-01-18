import {
  LOAD_MLSTN_SAGA,
  GET_TASKS_SAGA,
  GET_STATUS_SAGA,
  CLEAR_TASK_SAGA,
  GET_TASKS_DETAILS,
  GET_STAGER_TASKS,
  CLEAR_MLSTN_DATA,
} from './types';

const loadMlstnAction = prcsId => ({
  type: LOAD_MLSTN_SAGA,
  payload: prcsId,
});
const getTasksByTaskCategoryAction = parameters => ({
  type: GET_TASKS_SAGA,
  payload: parameters,
});
const getStatusByTaskAction = idTask => ({
  type: GET_STATUS_SAGA,
  payload: idTask,
});
const clearTasksAction = () => ({
  type: CLEAR_TASK_SAGA,
});
const getTaskDetails = taskNm => ({
  type: GET_TASKS_DETAILS,
  payload: taskNm,
});
const getStagerTasks = datas => ({
  type: GET_STAGER_TASKS,
  payload: datas,
});
const clearMlstnData = () => ({
  type: CLEAR_MLSTN_DATA,
});
export {
  loadMlstnAction,
  getStatusByTaskAction,
  getTasksByTaskCategoryAction,
  clearTasksAction,
  getTaskDetails,
  getStagerTasks,
  clearMlstnData,
};

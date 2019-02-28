import {
  GET_CHECKLIST_SAGA,
  GET_TASKS_SAGA,
  STORE_TASKS,
} from './types';

const getChecklist = taskId => ({
  type: GET_CHECKLIST_SAGA,
  payload: {
    taskId,
  },
});

const getTasks = (taskId, depth = 3) => ({
  type: GET_TASKS_SAGA,
  payload: {
    taskId,
    depth,
  },
});

const storeTasks = taskTree => ({
  type: STORE_TASKS,
  payload: taskTree,
});

export {
  getChecklist,
  getTasks,
  storeTasks,
};

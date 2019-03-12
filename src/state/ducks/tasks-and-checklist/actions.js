import {
  GET_NEXT_CHECKLIST,
  GET_PREV_CHECKLIST,
  GET_CHECKLIST_SAGA,
  GET_TASKS_SAGA,
  HANDLE_CHECKLIST_ITEM_CHANGE,
  SET_SELECTED_CHECKLIST,
  STORE_CHECKLIST_NAVIGATION,
  STORE_TASKS,
  STORE_TASK_FILTER,
  TOGGLE_INSTRUCTIONS,
} from './types';

const getNextChecklist = () => ({
  type: GET_NEXT_CHECKLIST,
});

const getPrevChecklist = () => ({
  type: GET_PREV_CHECKLIST,
});

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

const handleChecklistItemChange = (id, value) => ({
  type: HANDLE_CHECKLIST_ITEM_CHANGE,
  payload: {
    id,
    value,
  },
});

const setSelectedChecklist = taskId => ({
  type: SET_SELECTED_CHECKLIST,
  payload: {
    taskId,
  },
});

const storeTasks = taskTree => ({
  type: STORE_TASKS,
  payload: taskTree,
});

const storeTaskFilter = taskFilter => ({
  type: STORE_TASK_FILTER,
  payload: taskFilter,
});
const storeChecklistNavigation = navDataStructure => ({
  type: STORE_CHECKLIST_NAVIGATION,
  payload: navDataStructure,
});

const toggleInstructions = () => ({
  type: TOGGLE_INSTRUCTIONS,
});

export {
  getNextChecklist,
  getPrevChecklist,
  getChecklist,
  getTasks,
  handleChecklistItemChange,
  setSelectedChecklist,
  storeChecklistNavigation,
  storeTasks,
  storeTaskFilter,
  toggleInstructions,
};

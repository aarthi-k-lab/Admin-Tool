import {
  GET_NEXT_CHECKLIST,
  GET_PREV_CHECKLIST,
  GET_CHECKLIST_SAGA,
  GET_TASKS_SAGA,
  HANDLE_CHECKLIST_ITEM_CHANGE,
  RESET_DATA,
  SET_SELECTED_CHECKLIST,
  STORE_CHECKLIST_NAVIGATION,
  STORE_PROCESS_DETAILS,
  STORE_TASKS,
  STORE_TASK_FILTER,
  TOGGLE_INSTRUCTIONS,
} from './types';

const storeProcessDetails = (processId, rootTaskId) => ({
  type: STORE_PROCESS_DETAILS,
  payload: {
    processId,
    rootTaskId,
  },
});

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

const getTasks = (depth = 3) => ({
  type: GET_TASKS_SAGA,
  payload: {
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

const resetChecklistData = () => ({
  type: RESET_DATA,
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
  resetChecklistData,
  setSelectedChecklist,
  storeChecklistNavigation,
  storeProcessDetails,
  storeTasks,
  storeTaskFilter,
  toggleInstructions,
};

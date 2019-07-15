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
  STORE_OPTIONAL_TASKS,
  TOGGLE_INSTRUCTIONS,
  SHOW_OPTIONAL_TASKS,
  VALIDATION_DISPLAY,
  DISP_COMMENT_SAGA,
  EMPTY_DISPOSITION_COMMENT,
  DELETE_TASK,
  UPDATE_CHECKLIST,
  SHOW_DELETE_TASK_CONFIRMATION,
  RESET_DELETE_TASK,
  CLEAR_SUBTASK,
  UPDATE_COMMENTS,
  FETCH_DROPDOWN_OPTIONS_SAGA,
} from './types';

const getNextChecklist = () => ({
  type: GET_NEXT_CHECKLIST,
});

const getPrevChecklist = () => ({
  type: GET_PREV_CHECKLIST,
});

const validationDisplayAction = payload => ({
  type: VALIDATION_DISPLAY,
  payload,
});

const dispositionComments = payload => ({
  type: UPDATE_COMMENTS,
  payload,
});
const dispositionCommentAction = payload => ({
  type: DISP_COMMENT_SAGA,
  payload,
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

const handleChecklistItemChange = (id, value, taskCode) => ({
  type: HANDLE_CHECKLIST_ITEM_CHANGE,
  payload: {
    id,
    value,
    taskCode,
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

const storeOptionalTasks = optionalTasks => ({
  type: STORE_OPTIONAL_TASKS,
  payload: optionalTasks,
});

const storeProcessDetails = (processId, rootTaskId) => ({
  type: STORE_PROCESS_DETAILS,
  payload: {
    processId,
    rootTaskId,
  },
});

const toggleInstructions = () => ({
  type: TOGGLE_INSTRUCTIONS,
});

const showOptionalTasks = () => ({
  type: SHOW_OPTIONAL_TASKS,
});

const emptyDispositionComment = () => ({
  type: EMPTY_DISPOSITION_COMMENT,
});

const deleteTask = shouldDeleteTask => ({
  type: DELETE_TASK,
  payload: {
    shouldDeleteTask,
  },
});

const updateChecklist = payload => ({
  type: UPDATE_CHECKLIST,
  payload,
});

const showDeleteTaskConfirmation = payload => ({
  type: SHOW_DELETE_TASK_CONFIRMATION,
  payload,
});

const resetDeleteTaskConfirmation = () => ({ type: RESET_DELETE_TASK });

const subTaskClearance = (taskId, rootTaskId, taskBluePrintCode) => ({
  type: CLEAR_SUBTASK,
  payload: {
    id: taskId,
    rootTaskId,
    taskBlueprintCode: taskBluePrintCode,

  },
});

const getDropDownOptions = (source, additionalInfo) => ({
  type: FETCH_DROPDOWN_OPTIONS_SAGA,
  payload: {
    source,
    additionalInfo,
  },
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
  storeOptionalTasks,
  toggleInstructions,
  showOptionalTasks,
  validationDisplayAction,
  dispositionCommentAction,
  emptyDispositionComment,
  deleteTask,
  updateChecklist,
  showDeleteTaskConfirmation,
  resetDeleteTaskConfirmation,
  subTaskClearance,
  dispositionComments,
  getDropDownOptions,
};

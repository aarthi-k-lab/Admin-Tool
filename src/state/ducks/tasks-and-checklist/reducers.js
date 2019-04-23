import * as R from 'ramda';
import {
  ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS,
  LOADING_CHECKLIST,
  LOADING_TASKS,
  REMOVE_DIRTY_CHECKLIST,
  RESET_DATA,
  SET_SELECTED_CHECKLIST,
  STORE_CHECKLIST,
  STORE_CHECKLIST_ITEM_CHANGE,
  STORE_CHECKLIST_NAVIGATION,
  STORE_PROCESS_DETAILS,
  STORE_TASKS,
  STORE_TASK_FILTER,
  STORE_MISC_TASK_COMMENT,
  TOGGLE_INSTRUCTIONS,
  SHOW_OPTIONAL_TASKS,
  VALIDATION_DISPLAY,
  DISP_COMMENT,
  EMPTY_DISPOSITION_COMMENT,
} from './types';

const FAILED = 'failed';
const LOADING = 'loading';
const SUCCEEDED = 'succeeded';

const defaultState = {
  checklistLoadingStatus: SUCCEEDED,
  taskLoadingStatus: LOADING,
  dirtyChecklistItems: {},
  checklistItemsSaveQueue: [],
  checklistNavigation: {},
  processId: null,
  rootTaskId: null,
  selectedChecklist: 'nothing',
  showInstructionsDialog: false,
  taskComment: {},
  showOptionalTasks: false,
};

function storeChecklistItemChange(state, id, value) {
  const checklistItemsSaveQueue = [...state.checklistItemsSaveQueue, id];
  const oldDirtyValueForId = state.dirtyChecklistItems[id];
  const dirtyValueForId = oldDirtyValueForId
    ? [...oldDirtyValueForId, { value }]
    : [{ value }];
  const dirtyChecklistItems = { ...state.dirtyChecklistItems, [id]: dirtyValueForId };
  return {
    ...state,
    checklistItemsSaveQueue,
    dirtyChecklistItems,
  };
}

function removeDirtyChecklistItem(state) {
  const id = R.head(
    R.propOr([], 'checklistItemsSaveQueue', state),
  );
  const checklistItemsSaveQueue = R.tail(
    R.propOr([], 'checklistItemsSaveQueue', state),
  );
  const dirtyChecklist = R.tail(
    R.pathOr([], ['tasksAndChecklist', 'dirtyChecklistItems', id], state),
  );
  if (R.isEmpty(dirtyChecklist)) {
    return {
      ...state,
      checklistItemsSaveQueue,
      dirtyChecklistItems: R.dissoc(
        id,
        state.dirtyChecklistItems,
      ),
    };
  }
  return {
    ...state,
    checklistItemsSaveQueue,
    dirtyChecklistItems: {
      ...state.dirtyChecklistItems,
      [id]: dirtyChecklist,
    },
  };
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case ERROR_LOADING_CHECKLIST:
      return {
        ...state,
        checklistLoadingStatus: FAILED,
      };
    case ERROR_LOADING_TASKS:
      return {
        ...state,
        taskLoadingStatus: FAILED,
      };
    case LOADING_CHECKLIST:
      return {
        ...state,
        checklistLoadingStatus: LOADING,
      };
    case LOADING_TASKS:
      return {
        ...state,
        taskLoadingStatus: LOADING,
      };
    case REMOVE_DIRTY_CHECKLIST:
      return removeDirtyChecklistItem(state);
    case RESET_DATA:
      return defaultState;
    case SET_SELECTED_CHECKLIST:
      return {
        ...state,
        selectedChecklist: action.payload.taskId,
      };
    case STORE_CHECKLIST: {
      return {
        ...state,
        checklist: action.payload,
        checklistLoadingStatus: SUCCEEDED,
      };
    }
    case STORE_CHECKLIST_ITEM_CHANGE: {
      return storeChecklistItemChange(state, action.payload.id, action.payload.value);
    }
    case STORE_CHECKLIST_NAVIGATION: {
      return {
        ...state,
        checklistNavigation: action.payload,
      };
    }
    case VALIDATION_DISPLAY: {
      return {
        ...state,
        enableValidate: action.payload,
      };
    }
    case STORE_PROCESS_DETAILS: {
      const { payload: { processId, rootTaskId } } = action;
      return {
        ...state,
        processId,
        rootTaskId,
      };
    }

    case STORE_TASKS: {
      return {
        ...state,
        taskTree: action.payload,
        taskLoadingStatus: SUCCEEDED,
      };
    }
    case STORE_TASK_FILTER: {
      return {
        ...state,
        taskFilter: action.payload,
      };
    }
    case STORE_MISC_TASK_COMMENT: {
      return {
        ...state,
        taskComment: action.payload,
      };
    }
    case DISP_COMMENT: {
      return {
        ...state,
        dispositionComment: action.payload,
      };
    }
    case TOGGLE_INSTRUCTIONS: {
      return {
        ...state,
        showInstructionsDialog: !state.showInstructionsDialog,
      };
    }
    case SHOW_OPTIONAL_TASKS: {
      return {
        ...state,
        showOptionalTasks: !state.showOptionalTasks,
      };
    }
    case EMPTY_DISPOSITION_COMMENT: {
      return {
        ...state,
        dispositionComment: null,
      };
    }
    default:
      return state;
  }
};

export default reducer;

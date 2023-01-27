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
  STORE_CURRENT_CHECKLIST,
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
  STORE_OPTIONAL_TASKS,
  SHOW_DELETE_TASK_CONFIRMATION,
  DELETE_TASK,
  RESET_DELETE_TASK,
  HISTORICAL_CHECKLIST_DATA,
  ERROR_LOADING_HISTORICAL_CHECKLIST,
  UPDATE_COMMENTS,
  EMPTY_CHECKLIST_COMMENT,
  SAVE_DROPDOWN_OPTIONS,
  FILTER_RULES,
  SLA_RULES_PROCESSED,
  SAVE_RULE_RESPONSE,
  CLEAR_RULE_RESPONSE,
  SET_SLA_VALUES,
  CHECK_RULES_PASSED,
  COMPUTE_RULES_PASSED,
  SAVE_DROPDOWN_DATA,
  SET_LAST_UPDATED,
  SET_RFD_CHOICE,
  SAVE_MONTHLY_EXPENSE_VALUES,
  CURRENT_CHECKLIST_TYPE,
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
  optionalTasks: [],
  deleteTaskConfirmationDialog: {
    isOpen: false,
  },
  shouldDeleteTask: false,
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
    case SET_LAST_UPDATED: {
      const { lastUpdated } = action.payload;
      return {
        ...state,
        lastUpdated,
      };
    }
    case SAVE_DROPDOWN_DATA: {
      const { selector, formattedOptions } = action.payload;
      return R.assocPath(selector, formattedOptions, state);
    }
    case SAVE_MONTHLY_EXPENSE_VALUES: {
      const { selector, options } = action.payload;
      return R.assocPath(selector, options, state);
    }
    case CURRENT_CHECKLIST_TYPE:
      return {
        ...state,
        currentChecklistType: action.payload,
      };

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
    case HISTORICAL_CHECKLIST_DATA:
      return {
        ...state,
        historicalCheckList: action.payload,
      };
    case ERROR_LOADING_HISTORICAL_CHECKLIST:
      return {
        ...state,
        historicalCheckList: {},
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
    case STORE_CURRENT_CHECKLIST: {
      return {
        ...state,
        prevChecklistId: action.payload.id.checklistId,
        prevRootTaskId: action.payload.id.rootTaskId,
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
    case STORE_OPTIONAL_TASKS: {
      return {
        ...state,
        optionalTasks: action.payload,
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

    case UPDATE_COMMENTS: {
      return {
        ...state,
        checklistComments: action.payload,
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
    case EMPTY_CHECKLIST_COMMENT: {
      const { dispositionComment } = state;
      return {
        ...state,
        dispositionComment: Object.assign({}, dispositionComment, { comment: null }),
      };
    }

    case EMPTY_DISPOSITION_COMMENT: {
      return {
        ...state,
        dispositionComment: null,
      };
    }
    case SHOW_DELETE_TASK_CONFIRMATION: {
      const { payload: { deleteTaskConfirmationDialog } } = action;
      return {
        ...state,
        deleteTaskConfirmationDialog,
      };
    }
    case DELETE_TASK: {
      const { payload: { shouldDeleteTask } } = action;
      return {
        ...state,
        shouldDeleteTask,
      };
    }
    case RESET_DELETE_TASK: {
      return {
        ...state,
        shouldDeleteTask: defaultState.shouldDeleteTask,
      };
    }
    case SAVE_DROPDOWN_OPTIONS: {
      const options = R.concat([{
        displayName: '',
        id: '',
      }], action.payload);

      return {
        ...state,
        dropDownOptions: options,
      };
    }

    case FILTER_RULES: {
      return {
        ...state,
        filter: action.payload,
      };
    }
    case SLA_RULES_PROCESSED: {
      return {
        ...state,
        slaRulesprocessed: action.payload,
      };
    }
    case SAVE_RULE_RESPONSE: {
      return {
        ...state,
        ruleResponse: action.payload,
        filter: null,
      };
    }

    case CLEAR_RULE_RESPONSE:
    {
      return {
        ...state,
        ruleResponse: null,
      };
    }
    case SET_SLA_VALUES: {
      return {
        ...state,
        selectedSLAvalues: action.payload,
      };
    }

    case CHECK_RULES_PASSED: {
      return {
        ...state,
        isAllRulesPassed: action.payload,
      };
    }
    case COMPUTE_RULES_PASSED: {
      return {
        ...state,
        isAllRulesPassed: action.payload,
      };
    }
    case SET_RFD_CHOICE: {
      return {
        ...state,
        selectedRFDDesc: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;

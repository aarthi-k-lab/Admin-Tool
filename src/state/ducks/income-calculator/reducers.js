import * as R from 'ramda';
import {
  SET_BORROWERS_DATA,
  SHOW_LOADER,
  HIDE_LOADER,
  STORE_PROCESS_DETAILS,
  LOADING_TASKS,
  SET_SELECTED_CHECKLIST,
  LOADING_CHECKLIST,
  STORE_CHECKLIST,
  ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS,
  RESET_DATA,
  STORE_CHECKLIST_ITEM_CHANGE,
  REMOVE_DIRTY_CHECKLIST,
  SET_CHECKLIST_ID,
  SAVE_DROPDOWN_OPTIONS,
  SET_INCOMECALC_TOGGLE,
  SET_PROCESS_ID,
  SET_AUTOCOMPLETE_OPTIONS,
  SET_BANNER_DATA,
  STORE_INCOMECALC_HISTORY,
  SET_INCOMECALC_DATA,
  TOGGLE_HISTORY_VIEW,
  SET_HISTORY_ITEM,
  SET_MAIN_CHECKLISTID,
  SET_HISTORICAL_BORROWERS,
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
  const checklistItemsSaveQueue = R.union(state.checklistItemsSaveQueue, [id]);
  const dirtyChecklistItems = { ...state.dirtyChecklistItems, [id]: [{ value }] };
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
    R.pathOr([], ['incomeCalculator', 'dirtyChecklistItems', id], state),
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

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_HISTORICAL_BORROWERS: {
      const historicalBorrowers = action.payload;
      return {
        ...state,
        historicalBorrowers,
      };
    }
    case SET_MAIN_CHECKLISTID: {
      const mainChecklistId = action.payload;
      return {
        ...state,
        mainChecklistId,
      };
    }
    case TOGGLE_HISTORY_VIEW: {
      const isHistoryView = action.payload;
      return {
        ...state,
        isHistoryView,
      };
    }

    case SET_HISTORY_ITEM: {
      return {
        ...state,
        historyItem: action.payload,
      };
    }
    case SET_INCOMECALC_DATA: {
      const incomeCalcData = action.payload;
      return {
        ...state,
        ...incomeCalcData,
      };
    }
    case SET_AUTOCOMPLETE_OPTIONS: {
      return {
        ...state,
        autoCompleteOptions: action.payload,
      };
    }
    case SET_PROCESS_ID: {
      return {
        ...state,
        processId: action.payload,
      };
    }
    case SET_INCOMECALC_TOGGLE: {
      return {
        ...state,
        incomeCalc: action.payload,
      };
    }
    case SET_CHECKLIST_ID: {
      return {
        ...state,
        rootTaskId: action.payload,
      };
    }
    case SAVE_DROPDOWN_OPTIONS: {
      return {
        ...state,
        dropDownOptions: action.payload,
      };
    }
    case SET_BORROWERS_DATA: {
      return {
        ...state,
        processedBorrowerData: action.payload,
        loading: false,
      };
    }
    case SHOW_LOADER: {
      return {
        ...state,
        inProgress: true,
      };
    }
    case HIDE_LOADER: {
      return {
        ...state,
        inProgress: false,
      };
    }
    case LOADING_CHECKLIST:
      return {
        ...state,
        checklistLoadingStatus: LOADING,
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

    case STORE_CHECKLIST: {
      const { response, lastUpdated } = action.payload;
      return {
        ...state,
        checklist: response,
        checklistLoadingStatus: SUCCEEDED,
        lastUpdated,
      };
    }

    case STORE_INCOMECALC_HISTORY: {
      return {
        ...state,
        history: action.payload,
      };
    }

    case STORE_CHECKLIST_ITEM_CHANGE: {
      return storeChecklistItemChange(state, action.payload.id, action.payload.value);
    }

    case REMOVE_DIRTY_CHECKLIST:
      return removeDirtyChecklistItem(state);
    case RESET_DATA:
      return defaultState;
    case SET_SELECTED_CHECKLIST:
      return {
        ...state,
        selectedChecklist: action.payload.taskId,
      };

    case LOADING_TASKS:
      return {
        ...state,
        taskLoadingStatus: LOADING,
      };
    case STORE_PROCESS_DETAILS: {
      const { payload: processDetails } = action;
      return {
        ...state,
        processDetails,
      };
    }
    case SET_BANNER_DATA: {
      return {
        ...state,
        banner: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
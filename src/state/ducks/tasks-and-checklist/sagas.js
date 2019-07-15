import {
  takeEvery,
  all,
  call,
  put,
  select,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import {
  SET_SELECTED_CHECKLIST,
  GET_NEXT_CHECKLIST,
  GET_PREV_CHECKLIST,
  GET_CHECKLIST_SAGA,
  GET_TASKS_SAGA,
  ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS,
  HANDLE_CHECKLIST_ITEM_CHANGE,
  LOADING_CHECKLIST,
  LOADING_TASKS,
  REMOVE_DIRTY_CHECKLIST,
  STORE_CHECKLIST,
  STORE_CHECKLIST_ITEM_CHANGE,
  STORE_TASKS,
  EMPTY_CHECKLIST_COMMENT,
  // EMPTY_DISPOSITION_COMMENT,
  STORE_OPTIONAL_TASKS,
  STORE_MISC_TASK_COMMENT,
  DISP_COMMENT_SAGA,
  DISP_COMMENT,
  UPDATE_CHECKLIST,
  CLEAR_SUBTASK,
  FETCH_DROPDOWN_OPTIONS_SAGA,
  SAVE_DROPDOWN_OPTIONS,
} from './types';
import {
  USER_NOTIF_MSG,
  SET_GET_NEXT_STATUS,
} from '../dashboard/types';
import {
  SET_SNACK_BAR_VALUES,
} from '../notifications/types';
import * as actions from './actions';
import selectors from './selectors';
import { selectors as dashboardSelectors } from '../dashboard';
import { selectors as loginSelectors } from '../login';
import DashboardModel from '../../../models/Dashboard/index';
// import DropDownSelect from 'containers';

const ADD = 'ADD';
// const DELETE = 'DELETE';
const MISCTSK_CHK2 = 'MISCTSK_CHK2';
const autoDispositions = [{
  dispositionCode: 'allTasksCompleted',
  dispositionComment: 'All Tasks Completed',
}, {
  dispositionCode: 'approval',
  dispositionComment: 'approval',
},
];
function* getChecklist(action) {
  try {
    const { payload: { taskId } } = action;
    yield put({
      type: LOADING_CHECKLIST,
    });
    const response = yield call(Api.callGet, `/api/task-engine/task/${taskId}?depth=2&forceNoCache=${Math.random()}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    yield put({
      type: STORE_CHECKLIST,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: ERROR_LOADING_CHECKLIST,
    });
    const snackBar = {
      message: 'Checklist fetch failed.',
      type: 'error',
      open: true,
    };
    yield put({
      type: SET_SNACK_BAR_VALUES,
      payload: snackBar,
    });
  }
}


function* callAndPut(fn, ...args) {
  return yield put(yield call(fn, ...args));
}

function createNavigationDataStructureIter(ids, prev) {
  const id = R.head(ids);
  const next = R.head(R.tail(ids));
  if (R.isNil(id)) {
    return {};
  }
  return {
    [id]: {
      prev,
      next,
    },
    ...createNavigationDataStructureIter(R.tail(ids), id),
  };
}

function createNavigationDataStructure(ids, prev) {
  const id = R.head(ids);
  if (R.isNil(id)) {
    return {};
  }
  return {
    nothing: {
      prev,
      next: id,
    },
    ...createNavigationDataStructureIter(R.tail(ids), prev),
  };
}

function prependChecklistItemForNavigationWhenNoChecklistItemIsSelected(arr) {
  const inProgressChecklists = R.filter(R.propEq('state', 'in-progress'), arr);
  const firstInProgressChecklist = inProgressChecklists[inProgressChecklists.length - 1];
  if (R.isNil(firstInProgressChecklist)) {
    return R.prepend(R.head(arr), arr);
  }
  return R.prepend(firstInProgressChecklist, arr);
}

// createChecklistNavigation :: Object -> Object
const createChecklistNavigation = R.compose(
  createNavigationDataStructure,
  R.map(R.prop('id')),
  prependChecklistItemForNavigationWhenNoChecklistItemIsSelected,
  R.reduce(R.concat, []),
  R.map(
    R.compose(
      R.map(checklist => ({ id: R.prop('_id', checklist), state: R.prop('state', checklist) })),
      R.filter(R.propEq('visibility', true)),
      R.propOr([], 'subTasks'),
    ),
  ),
  R.filter(R.propEq('visibility', true)),
  R.propOr([], 'subTasks'),
);

function filterOptionalTasks(allTasks) {
  const isOptionalTask = R.pathEq(['taskBlueprint', 'type'], 'user-triggered');
  const getOptionalTasks = R.compose(
    R.map(task => ({
      id: R.prop('_id', task),
      visibility: R.propOr(false, 'visibility', task),
      name: R.pathOr('', ['taskBlueprint', 'name'], task),
      description: R.pathOr('', ['taskBlueprint', 'description'], task),
      taskCode: R.pathOr('', ['taskBlueprint', 'taskCode'], task),
      subTasks: R.propOr([], 'subTasks', task),
    })),
    R.filter(isOptionalTask),
    R.propOr([], 'subTasks'),
  );
  const optionalTasks = getOptionalTasks(allTasks);
  return optionalTasks;
}

function* getTasks(action) {
  try {
    const { payload: { depth } } = action;
    yield put({
      type: LOADING_TASKS,
    });
    yield put({
      type: USER_NOTIF_MSG,
      payload: {},
    });
    const rootTaskId = yield select(selectors.getRootTaskId);
    const response = yield call(Api.callGet, `/api/task-engine/task/${rootTaskId}?depth=${depth}&forceNoCache=${Math.random()}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    const optionalTasks = yield call(filterOptionalTasks, response);
    yield put({
      type: STORE_OPTIONAL_TASKS,
      payload: optionalTasks,
    });
    const checklistNavigation = yield call(createChecklistNavigation, response);
    const checklistNavAction = yield call(actions.storeChecklistNavigation, checklistNavigation);
    const checklistSelectionIsPresent = yield select(selectors.getSelectedChecklistId);
    let selectedChecklistId = null;
    if (checklistSelectionIsPresent === 'nothing') {
      selectedChecklistId = R.pathOr('', ['nothing', 'next'], checklistNavigation);
    }
    if (selectedChecklistId) {
      yield all([
        callAndPut(actions.setSelectedChecklist, selectedChecklistId),
        callAndPut(actions.getChecklist, selectedChecklistId),
      ]);
    }
    yield put(checklistNavAction);
    yield put({
      type: STORE_TASKS,
      payload: response,
    });
    const disposition = autoDispositions.find(disp => disp.dispositionCode === R.pathOr(null, ['value', 'dispositionCode'], response));
    if (disposition) {
      yield put(actions.validationDisplayAction(true));
      yield put(actions.dispositionCommentAction(disposition.dispositionComment));
    } else {
      yield put(actions.validationDisplayAction(false));
      yield put({ type: EMPTY_CHECKLIST_COMMENT });
    }
  } catch (e) {
    yield put({
      type: ERROR_LOADING_TASKS,
    });
    const snackBar = {};
    snackBar.message = 'Task/s fetch failed.';
    snackBar.type = 'error';
    snackBar.open = true;
    yield put({
      type: SET_SNACK_BAR_VALUES,
      payload: snackBar,
    });
  }
}

function* navigateChecklist(checklistId) {
  yield put(actions.setSelectedChecklist(checklistId));
  yield put(actions.getChecklist(checklistId));
}

function* getNextChecklist() {
  const nextChecklistId = yield select(selectors.getNextChecklistId);
  if (R.not(R.isNil(nextChecklistId))) {
    yield call(navigateChecklist, nextChecklistId);
  }
}

function* getPrevChecklist() {
  const prevChecklistId = yield select(selectors.getPrevChecklistId);
  if (R.not(R.isNil(prevChecklistId))) {
    yield call(navigateChecklist, prevChecklistId);
  }
}

function* showLoaderOnSave() {
  yield put({
    type: LOADING_CHECKLIST,
  });
  yield put({
    type: LOADING_TASKS,
  });
}

function* handleSaveChecklistError(e) {
  yield put({
    type: ERROR_LOADING_CHECKLIST,
  });
  yield put({
    type: ERROR_LOADING_TASKS,
  });
  const snackBar = {};
  snackBar.message = `Task save failed: ${e.message}`;
  snackBar.type = 'error';
  snackBar.open = true;
  yield put({
    type: SET_SNACK_BAR_VALUES,
    payload: snackBar,
  });
}

function isValidTaskPayload(action, taskCodeRef) {
  return !R.isNil(action.payload.taskCode)
    && !R.isEmpty(action.payload.taskCode) && R.equals(action.payload.taskCode, taskCodeRef);
}

function* postComment(action) {
  if (isValidTaskPayload(action, MISCTSK_CHK2)) {
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const user = yield select(loginSelectors.getUser);
    const groupName = yield select(dashboardSelectors.groupName);
    const page = DashboardModel.GROUP_INFO.find(group => group === groupName);
    const eventName = !R.isNil(page) ? page.taskCode : '';
    const taskName = !R.isNil(page) ? page.task : '';
    const taskId = yield select(dashboardSelectors.taskId);
    const taskIterationCounter = yield select(dashboardSelectors.taskIterationCounter);
    // const evalId = yield select(dashboardSelectors.evalId);
    const processId = yield select(dashboardSelectors.processId);
    const disposition = yield select(selectors.getDisposition);
    const commentPayload = {
      applicationName: 'CMOD',
      loanNumber,
      processIdType: 'WF_PRCS_ID',
      processId,
      eventName,
      comment: action.payload.value,
      userName: user.userDetails.name,
      createdDate: new Date().toJSON(),
      commentContext: JSON.stringify({
        TASK: taskName,
        TASK_ID: taskId,
        TASK_ACTN: disposition,
        TASK_ITRN_CNTR: taskIterationCounter,
        DSPN_IND: 1,
      }),
    };
    const payload = {};
    payload[action.payload.taskCode] = commentPayload;
    yield put({
      type: STORE_MISC_TASK_COMMENT,
      payload,
    });
  }
}

function* postDispositionComment(action) {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const user = yield select(loginSelectors.getUser);
  const groupName = yield select(dashboardSelectors.groupName);
  const page = DashboardModel.GROUP_INFO.find(pageInstance => pageInstance.group === groupName);
  const eventName = !R.isNil(page) ? page.taskCode : '';
  const taskName = !R.isNil(page) ? page.task : '';
  const taskId = yield select(dashboardSelectors.taskId);
  const taskIterationCounter = yield select(dashboardSelectors.taskIterationCounter);
  const processId = yield select(dashboardSelectors.processId);
  const disposition = yield select(selectors.getDisposition);
  const commentPayload = {
    applicationName: 'CMOD',
    loanNumber,
    processIdType: 'WF_PRCS_ID',
    processId,
    eventName,
    comment: action.payload,
    userName: user.userDetails.name,
    createdDate: new Date().toJSON(),
    commentContext: JSON.stringify({
      TASK: taskName,
      TASK_ID: taskId,
      TASK_ACTN: disposition,
      DSPN_IND: 1,
      TASK_ITRN_CNTR: taskIterationCounter,
    }),
  };
  yield put({
    type: DISP_COMMENT,
    payload: commentPayload,
  });
}

function* handleChecklistItemChange(action) {
  try {
    yield postComment(action);
    yield put({
      type: STORE_CHECKLIST_ITEM_CHANGE,
      payload: action.payload,
    });
    yield put({
      type: USER_NOTIF_MSG,
      payload: {
      },
    });
    yield put({
      type: SET_GET_NEXT_STATUS,
      payload: false,
    });
    const saveTask = yield select(selectors.getDirtyChecklistItemForSave);
    if (R.isNil(saveTask)) {
      throw new Error('Checklist item is not valid.');
    }
    yield call(showLoaderOnSave);
    yield call(Api.put, `/api/task-engine/task/${saveTask.id}`, saveTask.body);
    // clear the dirty state
    yield put({
      type: REMOVE_DIRTY_CHECKLIST,
    });
    const selectedChecklistId = yield select(selectors.getSelectedChecklistId);
    yield all([
      callAndPut(actions.setSelectedChecklist, selectedChecklistId),
      callAndPut(actions.getChecklist, selectedChecklistId),
    ]);
    // #TODO add the actual rootTaskId instead of null
    yield put(yield call(actions.getTasks));
  } catch (e) {
    yield call(handleSaveChecklistError, e);
  }
}

function* updateAndFetchTasks(fieldName, task, requestBody) {
  const response = yield call(Api.put, `/api/task-engine/hierarchy/update?fieldName=${fieldName}&fieldValue=${task.visibility}`, requestBody);
  const didErrorOccur = response === null;
  if (didErrorOccur) {
    throw new Error('Api call failed');
  }
  yield put({
    type: SET_SELECTED_CHECKLIST,
    payload: {
      taskId: 'nothing',
    },
  });
  yield put({
    type: GET_TASKS_SAGA,
    payload: { depth: 3 },
  });
}

function* updateChecklist(action) {
  try {
    const { task, fieldName, type } = action.payload;
    const requestBody = {
      // eslint-disable-next-line no-underscore-dangle
      id: task.id ? task.id : task._id,
    };
    if (type === ADD) {
      yield* updateAndFetchTasks(fieldName, task, requestBody, type);
    } else {
      const rootTaskId = yield select(selectors.getRootTaskId);
      const { id } = requestBody;
      const clearSubTaskRequestBody = {
        id,
        rootTaskId,
        taskBlueprintCode: task.taskBlueprintCode ? task.taskBlueprintCode : task.taskCode,
      };
      const response = yield call(Api.put, '/api/task-engine/task/clearSubTask', clearSubTaskRequestBody);
      const didErrorOccur = response === null;
      if (didErrorOccur) {
        throw new Error('Api call failed');
      }
      yield* updateAndFetchTasks(fieldName, task, requestBody, type);
    }
  } catch (e) {
    yield call(handleSaveChecklistError, e);
  }
}

function* subTaskClearance(action) {
  try {
    const { id, rootTaskId, taskBlueprintCode } = action.payload;
    const requestBody = {
      id, rootTaskId, taskBlueprintCode,
    };
    const response = yield call(Api.put, '/api/task-engine/task/clearSubTask', requestBody);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    } else {
      yield put({
        type: GET_CHECKLIST_SAGA,
        payload: { taskId: id },
      });
      yield put({
        type: GET_TASKS_SAGA,
        payload: { depth: 3 },
      });
    }
  } catch (e) {
    yield call(handleSaveChecklistError, e);
  }
}

function* getdropDownOptions(action) {
  const options = yield call(Api.callPost, '/api/task-engine/getData', action.payload);
  try {
    yield put({
      type: SAVE_DROPDOWN_OPTIONS,
      payload: options,
    });
  } catch (e) {
    yield call(handleSaveChecklistError, e);
  }
}

function* watchChecklistItemChange() {
  yield takeEvery(HANDLE_CHECKLIST_ITEM_CHANGE, handleChecklistItemChange);
}

function* watchGetChecklist() {
  yield takeEvery(GET_CHECKLIST_SAGA, getChecklist);
}

function* watchGetNextChecklist() {
  yield takeEvery(GET_NEXT_CHECKLIST, getNextChecklist);
}

function* watchGetPrevChecklist() {
  yield takeEvery(GET_PREV_CHECKLIST, getPrevChecklist);
}

function* watchGetTasks() {
  yield takeEvery(GET_TASKS_SAGA, getTasks);
}

function* watchDispositionComment() {
  yield takeEvery(DISP_COMMENT_SAGA, postDispositionComment);
}

function* watchUpdateChecklist() {
  yield takeEvery(UPDATE_CHECKLIST, updateChecklist);
}

function* watchSubtaskClearance() {
  yield takeEvery(CLEAR_SUBTASK, subTaskClearance);
}

function* watchDropDownOption() {
  yield takeEvery(FETCH_DROPDOWN_OPTIONS_SAGA, getdropDownOptions);
}
export const TestExports = {
  watchGetTasks,
};

export function* combinedSaga() {
  yield all([
    watchChecklistItemChange(),
    watchGetChecklist(),
    watchGetNextChecklist(),
    watchGetPrevChecklist(),
    watchGetTasks(),
    watchDispositionComment(),
    watchUpdateChecklist(),
    watchSubtaskClearance(),
    watchDropDownOption(),
  ]);
}

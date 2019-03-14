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
} from './types';
import {
  SET_SNACK_BAR_VALUES,
} from '../notifications/types';
import * as actions from './actions';
import selectors from './selectors';

function* getChecklist(action) {
  try {
    const { payload: { taskId } } = action;
    yield put({
      type: LOADING_CHECKLIST,
    });
    const response = yield call(Api.callGet, `/api/task-engine/task/${taskId}?depth=2`);
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
    ...createNavigationDataStructureIter(ids, prev),
  };
}

// createChecklistNavigation :: Object -> Object
const createChecklistNavigation = R.compose(
  createNavigationDataStructure,
  R.reduce(R.concat, []),
  R.map(
    R.compose(
      R.map(R.prop('_id')),
      R.filter(R.propEq('visibility', true)),
      R.propOr([], 'subTasks'),
    ),
  ),
  R.filter(R.propEq('visibility', true)),
  R.propOr([], 'subTasks'),
);

function* getTasks(action) {
  try {
    const { payload: { depth } } = action;
    yield put({
      type: LOADING_TASKS,
    });
    const rootTaskId = yield select(selectors.getRootTaskId);
    const response = yield call(Api.callGet, `/api/task-engine/task/${rootTaskId}?depth=${depth}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    const checklistNavigation = yield call(createChecklistNavigation, response);
    const checklistNavAction = yield call(actions.storeChecklistNavigation, checklistNavigation);
    yield put(checklistNavAction);
    yield put({
      type: STORE_TASKS,
      payload: response,
    });
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

function* callAndPut(fn, ...args) {
  return yield put(yield call(fn, ...args));
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

function* handleChecklistItemChange(action) {
  try {
    yield put({
      type: STORE_CHECKLIST_ITEM_CHANGE,
      payload: action.payload,
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
  ]);
}

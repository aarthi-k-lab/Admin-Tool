import {
  select,
  takeEvery,
  all,
  call,
  put,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import * as R from 'ramda';
import { selectors } from 'ducks/income-calculator/index';
import { selectors as taskSelectors } from 'ducks/tasks-and-checklist';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import logger from 'redux-logger';
import {
  FETCH_INCOMECALC_DATA, FETCH_INCOMECALC_HISTORY, SET_BORROWERS_DATA,
  SHOW_LOADER, HIDE_LOADER,
  FETCH_CHECKLIST,
  LOADING_TASKS, LOADING_CHECKLIST, STORE_CHECKLIST, ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS, HANDLE_CHECKLIST_ITEM_CHANGE,
  STORE_CHECKLIST_ITEM_CHANGE, GET_COMPANY_LIST, SET_AUTOCOMPLETE_OPTIONS,
  REMOVE_DIRTY_CHECKLIST,
  SET_PROCESS_ID, ADD_CONTRIBUTOR, FETCH_INCOMECALC_CHECKLIST,
  PROCESS_VALIDATIONS, SET_BANNER_DATA, DUPLICATE_INCOME, STORE_INCOMECALC_HISTORY,
} from './types';
import { USER_NOTIF_MSG, CHECKLIST_NOT_FOUND, TOGGLE_LOCK_BUTTON } from '../dashboard/types';
import { SET_SNACK_BAR_VALUES } from '../notifications/types';

import ChecklistErrorMessageCodes from '../../../models/ChecklistErrorMessageCodes';
import consolidateValidations from '../../../lib/consolidateValidation';

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

function* fetchChecklistDetails(action) {
  const processId = action.payload;
  try {
    const isChecklistIdInvalid = R.isNil(processId) || R.isEmpty(processId);
    if (isChecklistIdInvalid) {
      yield put({
        type: CHECKLIST_NOT_FOUND,
        payload: {
          messageCode: ChecklistErrorMessageCodes.NO_CHECKLIST_ID_PRESENT,
        },
      });
      return;
    }
    const response = yield call(Api.callGet, `/api/task-engine/process/${processId}?shouldGetTaskTree=true&visibility=true&forceNoCache=${Math.random()}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    const checklist = {
      lastUpdated: `${new Date()}`,
      response,
    };
    yield put({ type: SET_PROCESS_ID, payload: processId });
    yield put({ type: STORE_CHECKLIST, payload: checklist });
  } catch (e) {
    yield put({
      type: CHECKLIST_NOT_FOUND,
      payload: {
        messageCode: ChecklistErrorMessageCodes.CHECKLIST_FETCH_FAILED,
      },
    });
  }
}


const getTaskFromProcess = (taskObj, prop, value) => {
  if (R.propEq(prop, value)(taskObj)) {
    return taskObj;
  }
  const task = [];
  if (taskObj.subTasks && R.length(taskObj.subTasks) > 0) {
    taskObj.subTasks.forEach((subTask) => {
      task.push(getTaskFromProcess(subTask, prop, value));
    });
  }
  if (task) return task.flat();
  return null;
};

function* fetchIncomeCalcChecklist() {
  const process = yield select(taskSelectors.getChecklist);
  const incomeCalcProcess = getTaskFromProcess(process, 'taskBlueprintCode', 'INC_EXP');
  yield call(fetchChecklistDetails, { payload: R.propOr('', 'processInstance', R.head(incomeCalcProcess)) });
  // const processId = yield select(selectors.getTaskCheckListId);
  // const action = {
  //   payload: processId,
  // };
  // yield call(fetchChecklistDetails, action);
}

function* fetchIncomeCalcData() {
  try {
    yield put({ type: SHOW_LOADER });
    const process = yield select(taskSelectors.getChecklist);
    const incomeCalcProcess = getTaskFromProcess(process, 'taskBlueprintCode', 'INC_EXP');
    const response = [
      {
        borrowerPstnNumber: 1,
        borrowerAffilCd: '01',
        firstName: 'ALFA',
        middleName: '',
        lastName: 'LIMA1285',
        description: 'Borrower 1',
      },
      {
        borrowerPstnNumber: 2,
        borrowerAffilCd: '01',
        firstName: 'ZULU',
        middleName: '',
        lastName: 'RIMA1285',
        description: 'Borrower 2',
      },
      {
        borrowerPstnNumber: 3,
        borrowerAffilCd: '01',
        firstName: 'PAPA',
        middleName: '',
        lastName: 'RIMA1285',
        description: 'Borrower 3',
      },
      {
        borrowerPstnNumber: 4,
        borrowerAffilCd: '98',
        firstName: 'GAMA',
        middleName: '',
        lastName: 'RIMA1285',
        description: 'Borrower 4',
      },
      {
        borrowerPstnNumber: 5,
        borrowerAffilCd: '98',
        firstName: 'PAMA',
        middleName: '',
        lastName: 'RIMA1285',
        description: 'Borrower 4',
      },
      {
        borrowerPstnNumber: 6,
        borrowerAffilCd: '98',
        firstName: 'WAMA',
        middleName: '',
        lastName: 'RIMA1285',
        description: 'Borrower 4',
      },
      {
        borrowerPstnNumber: 7,
        borrowerAffilCd: '98',
        firstName: 'ZAMA',
        middleName: '',
        lastName: 'RIMA1285',
        description: 'Borrower 4',
      },
      {
        borrowerPstnNumber: 8,
        borrowerAffilCd: '98',
        firstName: 'RAMA',
        middleName: '',
        lastName: 'RIMA1285',
        description: 'Borrower 4',
      },
      {
        borrowerPstnNumber: 9,
        borrowerAffilCd: '98',
        firstName: 'JAMA',
        middleName: '',
        lastName: 'JIMA1285',
        description: 'Contributor 4',
      },
      {
        borrowerPstnNumber: 10,
        borrowerAffilCd: '98',
        firstName: 'DAMA',
        middleName: '',
        lastName: 'DIMA1285',
        description: 'Contributor 4',
      },
    ];
    yield call(fetchChecklistDetails, { payload: R.propOr('', 'processInstance', R.head(incomeCalcProcess)) });
    if (response != null) {
      yield put({
        type: SET_BORROWERS_DATA,
        payload: response,
      });
    } else {
      yield put({
        type: SET_BORROWERS_DATA,
        payload: { status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.' },
      });
    }
  } catch (e) {
    yield put({
      type: SET_BORROWERS_DATA,
      payload: { status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.' },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* fetchIncomeCalcHistory() {
  // const feuwTaskID = yield select(dashboardSelectors.taskId);
  const feuwTaskID = '1806566';
  try {
    const response = yield call(Api.callGet, `/api/dataservice/incomeCalc/history/${feuwTaskID}`);
    yield put({
      type: STORE_INCOMECALC_HISTORY,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: ERROR_LOADING_CHECKLIST,
    });
  }
}

function* getTasks() {
  try {
    const processId = yield select(selectors.getProcessId);
    if (R.isNil(processId) || R.isEmpty(processId)) {
      yield put({
        type: CHECKLIST_NOT_FOUND,
        payload: {
          messageCode: ChecklistErrorMessageCodes.NO_CHECKLIST_ID_PRESENT,
        },
      });
      return;
    }
    const response = yield call(Api.callGet, `/api/task-engine/process/${processId}?shouldGetTaskTree=true&visibility=true&forceNoCache=${Math.random()}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    }
    const checklist = {
      lastUpdated: `${new Date()}`,
      response,
    };
    yield put({
      type: STORE_CHECKLIST,
      payload: checklist,
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


function* showLoaderOnSave() {
  yield put({
    type: LOADING_CHECKLIST,
  });
  yield put({
    type: LOADING_TASKS,
  });
}


function* handleChecklistItemChange(action) {
  try {
    yield put({
      type: STORE_CHECKLIST_ITEM_CHANGE,
      payload: action.payload,
    });
    yield put({
      type: USER_NOTIF_MSG,
      payload: {
      },
    });
    const saveTask = yield select(selectors.getDirtyChecklistItemForSave);
    if (R.isNil(saveTask)) {
      throw new Error('Checklist item is not valid.');
    }
    yield call(showLoaderOnSave);
    yield call(Api.put, `/api/task-engine/task/${saveTask.id}`, saveTask.body);
    yield call(getTasks);
    // clear the dirty state
    yield put({
      type: REMOVE_DIRTY_CHECKLIST,
    });
  } catch (e) {
    yield call(handleSaveChecklistError, e);
  }
}

function* getCompanyList(action) {
  // TODO make api call to data service to fetch company list
  const searchTerm = action.payload;
  const columnName = 'WAGE_EARNINGS_ORG';
  const filteredList = yield call(Api.callGet, `/api/dataservice/api/colValMap/${columnName}?actvInd=Y&searchTerm=${searchTerm}`);
  yield put({ type: SET_AUTOCOMPLETE_OPTIONS, payload: R.pluck('val', filteredList) });
}

function* duplicateIncome(action) {
  const incomeChecklistId = action.payload;
  try {
    const feuwChecklistId = yield select(dashboardSelectors.processId);
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const request = {
      feuwChecklistId,
      loanNumber,
      incomeChecklistId,
    };
    const response = yield call(Api.callPost, '/api/workassign/incomeCalc/duplicateChecklist', request, {});
    const { _id: processId } = response;
    yield put({ type: SET_PROCESS_ID, payload: processId });
    yield call(fetchChecklistDetails, { payload: processId });
  } catch (e) {
    yield put({
      type: ERROR_LOADING_CHECKLIST,
    });
  }
}

function* addContributor(action) {
  try {
    yield put({ type: SHOW_LOADER });
    const dataToFetch = R.pathOr([], ['payload', 'contributorFields'], action);
    const data = yield select(selectors.getChecklist);
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const user = yield select(loginSelectors.getUser);
    const rootIdFEUW = yield select(taskSelectors.getRootTaskId);
    const dbRecCreatedByUser = R.path(['userDetails', 'email'], user);
    const taskData = R.flatten(dataToFetch.map(taskCode => getTaskFromProcess(data, 'taskBlueprintCode', taskCode)));
    let contributorData = {};
    taskData.forEach((task) => {
      contributorData = { ...contributorData, [R.path(['taskBlueprint', 'additionalInfo', 'fieldName'], task)]: task.value };
    });
    const borrowerData = yield select(selectors.getBorrowers);
    const borrowerlist = R.pathOr(null, ['value', 'inc', 'borrowers'], data);
    const payload = {
      contributorData: {
        ...contributorData, loanNumber, dbRecCreatedByUser, activeIndicator: 'Y',
      },
      borrowerData,
      borrowerlist,
      rootId: rootIdFEUW,
    };
    const borrowersResponse = yield call(Api.callPost, '/api/workassign/incomeCalc/addContributor', payload);
    if (borrowersResponse) {
      const processId = yield select(selectors.getProcessId);
      yield call(fetchChecklistDetails, { payload: processId });
      yield put({ type: SET_BORROWERS_DATA, payload: borrowersResponse });
    }
    yield put({ type: HIDE_LOADER });
  } catch (e) {
    yield put({});
  }
}

function* processValidations() {
  try {
    yield put({ type: SHOW_LOADER });
    const borrowers = yield select(selectors.getBorrowers);
    const processId = yield select(selectors.getProcessId);
    const checklist = yield call(Api.callGet, `/api/task-engine/process/${processId}?shouldGetTaskTree=true&forceNoCache=${Math.random()}`);
    const additionalData = {
      borrowers,
    };
    const banner = consolidateValidations(checklist, additionalData);
    yield put({
      type: TOGGLE_LOCK_BUTTON,
      payload: R.isEmpty(R.propOr([], 1, banner)),
    });
    yield put({
      type: SET_BANNER_DATA,
      payload: banner,
    });
  } catch (e) {
    logger.info(e);
  }
  yield put({ type: HIDE_LOADER });
}

function* watchFetchIncomeCalcData() {
  yield takeEvery(FETCH_INCOMECALC_DATA, fetchIncomeCalcData);
}

function* watchFetchIncomeCalcHistory() {
  yield takeEvery(FETCH_INCOMECALC_HISTORY, fetchIncomeCalcHistory);
}

function* watchfetchChecklist() {
  yield takeEvery(FETCH_CHECKLIST, fetchChecklistDetails);
}

function* watchChecklistItemChange() {
  yield takeEvery(HANDLE_CHECKLIST_ITEM_CHANGE, handleChecklistItemChange);
}

function* watchGetCompanyList() {
  yield takeEvery(GET_COMPANY_LIST, getCompanyList);
}

function* watchAddContributor() {
  yield takeEvery(ADD_CONTRIBUTOR, addContributor);
}

function* watchDuplicateIncome() {
  yield takeEvery(DUPLICATE_INCOME, duplicateIncome);
}

function* watchProcessValidations() {
  yield takeEvery(PROCESS_VALIDATIONS, processValidations);
}

function* watchFetchIncomeCalcChecklist() {
  yield takeEvery(FETCH_INCOMECALC_CHECKLIST, fetchIncomeCalcChecklist);
}

// eslint-disable-next-line
export const combinedSaga = function* combinedSaga() {
  yield all([
    watchFetchIncomeCalcChecklist(),
    watchProcessValidations(),
    watchAddContributor(),
    watchFetchIncomeCalcData(),
    watchFetchIncomeCalcHistory(),
    watchfetchChecklist(),
    watchChecklistItemChange(),
    watchGetCompanyList(),
    watchDuplicateIncome(),
  ]);
};

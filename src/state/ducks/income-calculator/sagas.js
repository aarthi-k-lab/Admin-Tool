/* eslint-disable no-unused-vars */
import {
  select,
  takeEvery,
  all,
  call,
  put,
} from 'redux-saga/effects';
import * as Api from 'lib/Api';
import * as R from 'ramda';
import { selectors as taskSelectors, actions as taskActions } from 'ducks/tasks-and-checklist';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import { selectors as widgetSelectors } from 'ducks/widgets';
import logger from 'redux-logger';
import { showLoader, hideLoader } from 'ducks/dashboard/actions';
import { SUCCESS, FAILED } from 'constants/common';
import { FINANCIAL_CALCULATOR } from 'constants/widgets';
import { nonSummableFields, expenseFields, checklistTypes } from 'constants/expenseCalc';
import componentTypes from 'constants/componentTypes';
import { selectors, actions } from './index';

import {
  SET_BORROWERS_DATA,
  SHOW_LOADER, HIDE_LOADER,
  FETCH_CHECKLIST, SET_HISTORICAL_BORROWERS,
  LOADING_TASKS, LOADING_CHECKLIST, STORE_CHECKLIST, ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS, HANDLE_CHECKLIST_ITEM_CHANGE,
  STORE_CHECKLIST_ITEM_CHANGE, GET_COMPANY_LIST, SET_AUTOCOMPLETE_OPTIONS,
  REMOVE_DIRTY_CHECKLIST, SET_INCOMECALC_DATA,
  SET_PROCESS_ID, ADD_CONTRIBUTOR, FETCH_INCOMECALC_CHECKLIST,
  PROCESS_VALIDATIONS, SET_BANNER_DATA, DUPLICATE_INCOME, STORE_INCOMECALC_HISTORY,
  CLOSE_INC_HISTORY,
  SET_MAIN_CHECKLISTID,
  TOGGLE_HISTORY_VIEW,
  FETCH_HISTORY_INFO,
  LOCK_INCOME_CALCULATION,
  CLEAR_TASK_VALUE,
} from './types';
import {
  USER_NOTIF_MSG, CHECKLIST_NOT_FOUND, TOGGLE_LOCK_BUTTON, TOGGLE_BANNER, SET_RESULT_OPERATION,
  SET_POPUP_DATA,
} from '../dashboard/types';
import {
  UPDATE_CONSOLIDATE_EXPENSE_DATA, TOGGLE_VIEW,
} from '../tombstone/types';
import { SET_SNACK_BAR_VALUES } from '../notifications/types';
import ChecklistErrorMessageCodes from '../../../models/ChecklistErrorMessageCodes';
import consolidateValidations from '../../../lib/consolidateValidation';
import { incTypeMap } from '../../../constants/incomeCalc';

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
    const response = yield call(Api.callGet, `/api/task-engine/process/${processId}?shouldGetTaskTree=true&visibility=true&aggregation=true&forceNoCache=${Math.random()}`);
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

function* fetchHistoryChecklist(action) {
  yield put({ type: SHOW_LOADER });
  yield call(fetchChecklistDetails, action);
  const borrowerList = yield select(selectors.getBorrowersList);
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const borrowerRequest = R.map(borrower => ({
    loanNumber,
    borrowerPstnNumber: R.nth(1, R.split('_', borrower)),
    firstName: R.nth(0, R.split('_', borrower)),
  }), borrowerList);
  const borrowerData = yield call(Api.callPost, '/api/dataservice/incomeCalc/historicalBorrowers', borrowerRequest);
  yield put({ type: SET_HISTORICAL_BORROWERS, payload: borrowerData });
  yield put({ type: HIDE_LOADER });
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

function* fetchIncomeCalcHistory() {
  const processId = yield select(dashboardSelectors.processId);
  const taskBluePrintCode = yield select(selectors.getTaskBlueprintCode);
  const checklistType = taskBluePrintCode && (taskBluePrintCode === 'INC_EXP' || taskBluePrintCode === 'INCVRFN')
    ? checklistTypes.INCOME : checklistTypes.EXPENSE;
  try {
    const response = yield call(Api.callGet, `/api/dataservice/incomeCalc/history/${processId}/${checklistType}`);
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

function* updateFinanceCalcFieldValues(type) {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const evalId = yield select(dashboardSelectors.evalId);
  const loanId = loanNumber;
  const tkamsData = yield call(Api.callGet, `/api/tkams/search/BorrowerExpense/${loanNumber}/${evalId}`);
  let latestIncomeDetails = null;

  if (tkamsData) {
    const {
      mortgageInsuranceP1, paymentAmount, shortageP1, insuranceP1, taxesP1, primaryUseId,
      waterFallId,
    } = tkamsData;

    const latestExpenseDetails = {
      monthlyExpenseFieldValues: {
        mortgageInsuranceP1,
        paymentAmount,
        shortageP1,
        insuranceP1,
        taxesP1,
        primaryUseId,
        waterFallId,
      },
    };

    if (type === 'income-calculator') {
      const { totalMonthlyDebt } = yield call(Api.callGet, `/api/tkams/search/BorrowerTotalMonthlyDebt/${loanId}`);
      latestIncomeDetails = {
        totalMonthlyDebt,
        paymentAmount,
      };
    }

    const checklistData = yield select(selectors.getChecklist);
    const taskObj = R.propOr(null, 'value', checklistData);
    const rootId = R.prop('_id', checklistData);
    if (rootId && type === 'expense-calculator') {
      yield call(Api.put, `/api/task-engine/task/${rootId}`, { value: { ...taskObj, latestExpenseDetails } });
    }
    if (rootId && type === 'income-calculator') {
      yield call(Api.put, `/api/task-engine/task/${rootId}`, { value: { ...taskObj, latestIncomeDetails } });
    }
  }
}

function* fetchIncomeCalcChecklist(action) {
  try {
    const {
      isOpen: isWidgetOpen, processInstance, calcType, type,
    } = action.payload;
    if (isWidgetOpen) {
      // Income Calculator widget
      yield put(showLoader());
      const processId = yield select(dashboardSelectors.processId);
      const financeCalcData = yield call(Api.callGet, `/api/financial-aggregator/financecalc/checklistForWidget/${processId}`);
      if (financeCalcData) {
        const data = {
          ...financeCalcData,
          disableChecklist: true,
        };
        yield put({ type: SET_INCOMECALC_DATA, payload: data });
        yield call(updateFinanceCalcFieldValues, type);
      }
      const taskChecklistId = R.pathOr('', [calcType, 'taskCheckListId'], financeCalcData);
      yield call(fetchChecklistDetails, { payload: taskChecklistId });
      yield call(fetchIncomeCalcHistory);
      yield put({ type: SET_MAIN_CHECKLISTID, payload: taskChecklistId });
      yield put(hideLoader());
    } else if (processInstance) {
      // Income Calculator checklist via checklist
      yield put({ type: SHOW_LOADER });
      yield put({ type: SET_INCOMECALC_DATA, payload: { disableChecklist: false } });
      yield call(updateFinanceCalcFieldValues, type);
      yield call(fetchChecklistDetails, { payload: processInstance });
      yield put({ type: SET_MAIN_CHECKLISTID, payload: processInstance });
      yield call(fetchIncomeCalcHistory);
      yield put({ type: HIDE_LOADER });
    }
    yield put({ type: TOGGLE_HISTORY_VIEW, payload: false });
  } catch (e) {
    logger.info(e);
  }
}


function* closeIncomeHistory() {
  let calcType = 'incomeCalcData';
  const checklistType = yield select(selectors.getWidgetCheckListType);
  const processInstance = yield select(selectors.getMainChecklist);
  const widgetList = yield select(widgetSelectors.getOpenWidgetList);
  calcType = checklistType === 'income-calculator' ? 'incomeCalcData' : 'expenseCalcData';
  const payload = {
    processInstance,
    isOpen: R.contains(FINANCIAL_CALCULATOR, widgetList),
    calcType,
  };
  yield put(actions.getIncomeCalcChecklist(payload));
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
    const response = yield call(Api.callGet, `/api/task-engine/process/${processId}?shouldGetTaskTree=true&visibility=true&aggregation=true&forceNoCache=${Math.random()}`);
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
    yield put({
      type: TOGGLE_LOCK_BUTTON,
      payload: false,
    });
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
    const feuwChecklistId = yield select(taskSelectors.getProcessId);
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const taskId = yield select(dashboardSelectors.taskId);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const request = {
      feuwChecklistId,
      loanNumber,
      financialChecklistId: incomeChecklistId,
      taskId,
      userPrincipalName,
    };

    const duplicationResponse = yield call(Api.callPost, '/api/financial-aggregator/expenseCalc/duplicateChecklist', request);
    if (duplicationResponse.status === 200) {
      const { response } = duplicationResponse;
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          status: 'Checklist duplication successful',
          level: SUCCESS,
        },
      });
      const { _id: processId } = response;
      yield put({ type: SET_PROCESS_ID, payload: processId });
      yield call(fetchChecklistDetails, { payload: processId });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          status: 'Failed to duplicate checklist',
          level: FAILED,
        },
      });
    }
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
    const taskValues = yield select(selectors.getTaskValues);
    let contributorData = {};
    taskData.forEach((task) => {
      contributorData = { ...contributorData, [R.path(['taskBlueprint', 'additionalInfo', 'fieldName'], task)]: task.value };
    });
    const borrowerData = yield select(selectors.getBorrowers);
    const borrowerlist = R.pathOr(null, ['value', 'inc', 'borrowers'], data);
    const maxPositionNum = R.compose(
      R.prop('borrowerPstnNumber'),
      R.last,
      R.sortBy(R.prop('borrowerPstnNumber')),
    )(borrowerData);
    const payload = {
      contributorData: {
        ...contributorData,
        taxpyrIdVal: R.propOr('', 'INC_ADD_CHK3', taskValues),
        loanNumber,
        dbRecCreatedByUser,
        borrowerPstnNumber: maxPositionNum + 1,
      },
      borrowerData,
      borrowerlist,
      rootId: rootIdFEUW,
    };
    const borrowersResponse = yield call(Api.callPost, '/api/financial-aggregator/incomeCalc/addContributor', payload);
    if (borrowersResponse) {
      const processId = yield select(selectors.getProcessId);
      yield call(fetchChecklistDetails, { payload: processId });
      yield put({ type: SET_BORROWERS_DATA, payload: R.propOr([], 'response', borrowersResponse) });
    }
    yield put({ type: CLEAR_TASK_VALUE });
    yield put({ type: HIDE_LOADER });
  } catch (e) {
    yield put({});
  }
}

function* gatherDataForValidation() {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const sodsData = yield call(Api.callGet, `/api/ods-gateway/incomeCalc/${loanNumber}`);
  const externalData = {
    investorName: R.pathOr(null, ['InvestorHierarchy', 'levelName'], sodsData),
  };
  return externalData;
}

function* processValidations() {
  try {
    yield put({ type: SHOW_LOADER });
    const borrowers = yield select(selectors.getBorrowers);
    const processId = yield select(selectors.getProcessId);
    const checklistData = yield select(selectors.getChecklist);
    let externalData = null;
    const taskBluePrintCode = yield select(selectors.getTaskBlueprintCode);
    const taskObj = R.propOr(null, 'value', checklistData);
    const rootId = R.prop('_id', checklistData);
    if (taskBluePrintCode === 'INC_EXP') {
      externalData = yield call(gatherDataForValidation);
    }
    if (rootId) {
      yield call(Api.put, `/api/task-engine/task/${rootId}`, { value: { ...taskObj, externalData } });
      const checklist = yield call(Api.callGet, `/api/task-engine/process/${processId}?shouldGetTaskTree=true&aggregation=true&forceNoCache=${Math.random()}`);
      const additionalData = {
        borrowers,
      };
      const banner = consolidateValidations(checklist, additionalData);
      const response = yield call(Api.callGet, `/api/task-engine/process/${processId}?shouldGetTaskTree=true&visibility=true&aggregation=true&forceNoCache=${Math.random()}`);
      const data = {
        lastUpdated: `${new Date()}`,
        response,
      };
      yield put({ type: STORE_CHECKLIST, payload: data });
      yield put({
        type: TOGGLE_LOCK_BUTTON,
        payload: R.isEmpty(R.propOr([], 1, banner)),
      });
      yield put({
        type: TOGGLE_BANNER,
        payload: !R.isEmpty(R.propOr([], 1, banner)) || !R.isEmpty(R.propOr([], 2, banner)),
      });
      yield put({
        type: SET_BANNER_DATA,
        payload: banner,
      });
    }
  } catch (e) {
    logger.info(e);
  }
  yield put({ type: HIDE_LOADER });
}

function setDefaultBorrExpenseData() {
  const data = {};
  R.forEach((field) => {
    data[field] = 0.00;
  }, expenseFields);
  return data;
}

function* summateValuesForBorrowers(borrowerList) {
  let defaultBorrExpenseAmount = yield call(setDefaultBorrExpenseData);
  try {
    let borrExpenseAmounts = yield select(selectors.getExpenseAmounts);
    borrExpenseAmounts = R.reject(R.isNil, borrExpenseAmounts);
    const expenseKeys = Object.keys(defaultBorrExpenseAmount);
    const expList = [];
    R.forEach((borrower) => {
      const expDetails = R.find(R.has(borrower))(borrExpenseAmounts);
      if (expDetails) {
        expList.push(expDetails[borrower]);
      }
    }, borrowerList);
    R.forEach((field) => {
      let value = 0;
      value = nonSummableFields.includes(field) ? R.defaultTo(0, R.head(expList)[field])
        : R.sum(R.reject(val => !val, R.pluck(field)(expList)));
      defaultBorrExpenseAmount = { ...defaultBorrExpenseAmount, [field]: value };
    }, expenseKeys);
    const totalMonthlyDebt = R.sum(Object.values(defaultBorrExpenseAmount));
    defaultBorrExpenseAmount = { ...defaultBorrExpenseAmount, totalMonthlyDebt };
  } catch (e) {
    logger.info('Error in summating borrower expense data ', e);
  }
  return defaultBorrExpenseAmount;
}

const lockCalculation = function* lockCalculation() {
  try {
    const { INCOME_CALCULATOR: incomeCalculator } = componentTypes;
    const currentChecklistType = yield select(taskSelectors.getCurrentChecklistType);
    const checklistType = currentChecklistType === incomeCalculator
      ? checklistTypes.INCOME : checklistTypes.EXPENSE;
    const checklistSelectionIsPresent = yield select(taskSelectors.getSelectedChecklistId);
    yield put({ type: SHOW_LOADER });
    const feuwChecklistId = yield select(taskSelectors.getProcessId);
    const consolidatedData = yield select(selectors.getConsolidatedIncome);
    const borrowerInfo = yield select(selectors.getBorrowers);
    const borrowerList = yield select(selectors.getBorrowersList);
    const consolidation = [];
    let summatedBorrData = {};
    if (checklistType === checklistTypes.EXPENSE) {
      summatedBorrData = yield call(summateValuesForBorrowers, borrowerList);
    } else if (checklistType === checklistTypes.INCOME) {
      R.forEach((item) => {
        const cnsdtIncome = {};
        R.forEach((incomeType) => {
          const incomeData = R.reject(R.isNil, R.flatten(R.pluck(incomeType,
            R.pluck(item, R.flatten(consolidatedData)))));
          if (incomeData.length) {
            cnsdtIncome[incomeType] = incomeData;
          }
        }, R.keys(incTypeMap));
        if (cnsdtIncome) {
          borrowerInfo.forEach((borr) => {
            if (R.equals(`${borr.firstName}_${borr.borrowerPstnNumber}`, item)) {
              consolidation.push({ borrowerName: `${borr.firstName} ${borr.lastName}`, cnsdtIncome });
            }
          });
        }
      }, borrowerList);
    }
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const taskId = yield select(dashboardSelectors.taskId);
    const taskCheckListId = yield select(selectors.getProcessId);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const loginName = R.path(['userDetails', 'name'], user);
    const evalId = yield select(dashboardSelectors.evalId);
    let response = {};
    if (checklistType === checklistTypes.INCOME) {
      response = yield call(Api.callPost, `/api/cmodnetcoretkams/IncomeFinancial/lock/${loanNumber}`,
        consolidation);
    } else {
      response = yield call(Api.callPost, `/api/cmodnetcoretkams/ExpenseFinancial/lock/${loanNumber}?loginName=${loginName}`,
        summatedBorrData);
    }
    const lockId = response && typeof (response) === 'object' ? R.propOr(null, 'lockId', response) : response;
    if (lockId) {
      const request = {
        taskId,
        loanNumber,
        evalId,
        userPrincipalName,
        taskCheckListId,
        calcDateTime: new Date(),
        feuwChecklistId,
        checklistType,
        lockId,
      };
      const dbResult = yield call(Api.callPost, '/api/financial-aggregator/incomeCalc/lock/', request);
      if (R.equals(R.propOr(null, 'status', dbResult), 200)) {
        const expenseResult = yield call(Api.callGet, `/api/tkams/getModInfoData/${evalId}`);
        yield put({
          type: UPDATE_CONSOLIDATE_EXPENSE_DATA,
          payload: expenseResult,
        });
        yield put({
          type: TOGGLE_VIEW,
        });
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: `${checklistType} is Locked successfully`,
            level: 'Success',
            title: 'Lock Calculation',
          },
        });
        yield put({
          type: TOGGLE_LOCK_BUTTON,
          payload: false,
        });
        const processId = R.path(['response', '_id'], dbResult);
        yield all([
          put(taskActions.getTasks()),
          put(taskActions.getChecklist(checklistSelectionIsPresent)),
        ]);
        const payload = {
          processInstance: processId,
          isOpen: false,
        };
        yield put(actions.getIncomeCalcChecklist(payload));
      } else {
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: `${checklistType} Lock failed due to Borrower data discrepency,
            please select "YES" to manually update Remedy and "Retry" to try again`,
            level: 'Failed',
            title: 'Lock Calculation',
            showCancelButton: true,
            confirmButtonText: 'Retry',
            cancelButtonText: 'Yes',
            onConfirm: LOCK_INCOME_CALCULATION,
          },
        });
      }
    } else {
      yield put({
        type: SET_POPUP_DATA,
        payload: {
          message: `${checklistType} is not Locked in REMEDY`,
          level: 'Failed',
          title: 'Lock Calculation',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: e.message,
        level: 'Failed',
      },
    });
  }
  yield put({ type: HIDE_LOADER });
};

function* watchLockCalc() {
  yield takeEvery(LOCK_INCOME_CALCULATION, lockCalculation);
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


function* watchCloseIncomeHistory() {
  yield takeEvery(CLOSE_INC_HISTORY, closeIncomeHistory);
}

function* watchHistoryChecklist() {
  yield takeEvery(FETCH_HISTORY_INFO, fetchHistoryChecklist);
}

// eslint-disable-next-line
export const combinedSaga = function* combinedSaga() {
  yield all([
    watchHistoryChecklist(),
    watchFetchIncomeCalcChecklist(),
    watchProcessValidations(),
    watchAddContributor(),
    watchfetchChecklist(),
    watchChecklistItemChange(),
    watchGetCompanyList(),
    watchDuplicateIncome(),
    watchCloseIncomeHistory(),
    watchLockCalc(),
  ]);
};

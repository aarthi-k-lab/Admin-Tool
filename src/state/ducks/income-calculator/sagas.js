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
import { SUCCESS, FAILED, ERROR } from 'constants/common';
import { FINANCIAL_CALCULATOR } from 'constants/widgets';
import { nonSummableFields, expenseFields, checklistTypes } from 'constants/expenseCalc';
import componentTypes from 'constants/componentTypes';
import { AV, FEUW_CHECKLIST } from 'constants/frontEndChecklist';
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
  FETCH_SELECTED_BORROWER_DATA,
  SET_SELECTED_BORROWER_DATA,
  SET_SELECTED_CHECKLIST_DATA,
  FETCH_SELECTED_CHECKLIST_DATA,
  FICO_LOCK_CALCULATION,
  FETCH_FICO_TABLE_DATA,
  SET_FICO_TABLE_DATA,
  UPDATE_CHECKLIST_TASKS,
  SET_LOCK_AV,
  ASSET_LOCK_CALCULATION,
} from './types';
import {
  SET_SELECTED_BORROWER,
} from '../document-checklist/types';
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
import { FICO_SCORE, FICO_TASK_BLUEPRINT_CODE } from '../../../constants/tableSchema';

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

const fetchBorrowerData = function* fetchBorrowerData(action) {
  const data = yield select(selectors.getChecklist);
  const taskData = getTaskFromProcess(data, 'taskBlueprintCode', action.payload);
  const borrowerName = R.pathOr('', [0, 'value', 'selectedBorrower'], taskData);
  yield put({
    type: SET_SELECTED_BORROWER_DATA,
    payload: borrowerName,
  });
  yield put({
    type: SET_SELECTED_BORROWER,
    payload: { selectedBorrower: borrowerName },
  });
};

const fetchChecklistFieldData = function* fetchChecklistFieldData(action) {
  const data = yield select(selectors.getChecklist);
  const taskData = getTaskFromProcess(data, 'taskBlueprintCode', action.payload);
  const fieldValue = R.pathOr('', [0, 'value'], taskData);
  const decimalValidation = fieldValue.split('.');
  // need to handle anabling lock button for multiple tasks in future.
  let enableLockbutton = false;
  if (!R.isEmpty(fieldValue) && decimalValidation.length === 1) {
    enableLockbutton = true;
  }
  if (decimalValidation.length > 1) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        message: 'Fico Score is not a decimal number. ',
        level: 'Error',
        title: 'Lock Calculation',
      },
    });
  }
  yield put({
    type: TOGGLE_LOCK_BUTTON,
    payload: { enable: enableLockbutton, selectedChecklistLock: '' },
  });
  yield put({
    type: SET_SELECTED_CHECKLIST_DATA,
    payload: fieldValue,
  });
};

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
  const taskBluePrintCode = yield select(taskSelectors.selectedTaskBlueprintCode);
  const currentChecklistType = yield select(taskSelectors.getCurrentChecklistType);
  const checklistType = checklistTypes[currentChecklistType];
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
    if (FEUW_CHECKLIST.includes(taskBluePrintCode)) {
      yield put({ type: FETCH_SELECTED_BORROWER_DATA, payload: FICO_TASK_BLUEPRINT_CODE });
      yield put({ type: FETCH_SELECTED_CHECKLIST_DATA, payload: FICO_SCORE });
    } if (checklistType === 'AV') {
      yield put({ type: SET_LOCK_AV });
    }
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

function* fetchIncomeCalcHistory() {
  const processId = yield select(dashboardSelectors.processId);
  const taskBluePrintCode = yield select(selectors.getTaskBlueprintCode);
  // eslint-disable-next-line no-nested-ternary
  const checklistType = taskBluePrintCode ? (taskBluePrintCode === 'INC_EXP' || taskBluePrintCode === 'INCVRFN')
    ? checklistTypes['income-calculator'] : (taskBluePrintCode === 'FEUW_AV' || taskBluePrintCode === 'ASTVRFN') ? checklistTypes['asset-verification'] : checklistTypes['expense-calculator'] : '';
  try {
    const response = yield call(Api.callGet, `/api/dataservice/incomeCalc/history/${processId}/${checklistType}`);
    yield put({
      type: STORE_INCOMECALC_HISTORY,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: STORE_INCOMECALC_HISTORY,
      payload: [],
    });
    yield put({
      type: ERROR_LOADING_CHECKLIST,
    });
  }
}

function* updateFinanceCalcFieldValues(type) {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const evalId = yield select(dashboardSelectors.evalId);
  const loanId = loanNumber;
  const lockedHistoryData = yield call(Api.callGet, `/api/tkams/search/BorrowerExpenseFinancial/${loanNumber}`);
  const tkamsData = yield call(Api.callGet, `/api/tkams/search/BorrowerExpense/${loanNumber}/${evalId}`);
  let latestIncomeDetails = null;
  if (tkamsData) {
    const { primaryUseId, waterFallId, completedDate } = tkamsData;
    let {
      mortgageInsuranceP1, paymentAmount, shortageP1, insuranceP1, taxesP1,
    } = tkamsData;

    if (lockedHistoryData && type === 'expense-calculator') {
      const {
        lockedDate, propertyTaxes, nstr1stMortgage,
        homeOwnersInsurance, loanEscrowShortage, mortgageInsurance,
      } = lockedHistoryData;
      if ((R.isNil(completedDate) && !R.isNil(lockedDate)) || lockedDate > completedDate) {
        mortgageInsuranceP1 = mortgageInsurance;
        paymentAmount = nstr1stMortgage;
        shortageP1 = loanEscrowShortage;
        insuranceP1 = homeOwnersInsurance;
        taxesP1 = propertyTaxes;
      }
    }
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
    const taskBluePrintCode = yield select(taskSelectors.selectedTaskBlueprintCode);
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
      if (taskBluePrintCode === 'ASTVRFN') {
        yield put({ type: SET_LOCK_AV });
      }
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

function* getAssetLockstatus() {
  const data = yield select(selectors.getChecklist);
  const taskData = R.flatten(AV.map(taskCode => getTaskFromProcess(data, 'taskBlueprintCode', taskCode)));
  let contributorData = {};
  taskData.forEach((task) => {
    contributorData = { ...contributorData, [R.path(['taskBlueprintCode'], task)]: task.value };
  });
  const enableLockbutton = R.any((task) => {
    const fieldValue = R.pathOr('', ['value'], task);
    if (!R.isEmpty(fieldValue)) {
      return true;
    }
    return false;
  }, taskData);
  yield put({
    type: TOGGLE_LOCK_BUTTON,
    payload: { enable: enableLockbutton, selectedChecklistLock: '' },
  });
}

function* handleChecklistItemChange(action) {
  const currentChecklistType = yield select(taskSelectors.getCurrentChecklistType);
  const checklistType = checklistTypes[currentChecklistType];
  const taskBluePrintCode = yield select(taskSelectors.selectedTaskBlueprintCode);
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
    if (FEUW_CHECKLIST.includes(taskBluePrintCode)) {
      yield put({ type: FETCH_SELECTED_BORROWER_DATA, payload: FICO_TASK_BLUEPRINT_CODE });
      yield put({ type: FETCH_SELECTED_CHECKLIST_DATA, payload: FICO_SCORE });
    } else if (checklistType === 'AV') {
      yield put({ type: SET_LOCK_AV });
    } else if (checklistType === 'INCOME') {
      yield put({
        type: TOGGLE_LOCK_BUTTON,
        payload: { enable: false, selectedChecklistLock: '' },
      });
    }
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
    const currentChecklistType = yield select(taskSelectors.getCurrentChecklistType);
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
        payload: { enable: R.isEmpty(R.propOr([], 1, banner)), selectedChecklistLock: `${currentChecklistType}-lock` },
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

const checkDuplicate = (filterResponseData) => {
  const isDuplicateValuePresent = [];
  let objList = {
    checkingAccount: [],
    savingsAccount: [],
    ira: [],
    stocks: [],
  };
  if (filterResponseData && filterResponseData.length > 0) {
    filterResponseData.forEach((borrData) => {
      if (borrData) {
        const indvData = R.dissoc('selectedState', R.prop(0, R.values(borrData)));
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(objList)) {
          const rec = R.propOr([], key, R.dissoc('key', objList));
          rec.push(R.propOr(0, key, indvData));
          objList = { ...objList, key: rec };
        }
      }
    });
    objList = R.dissoc('key', objList);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(objList)) {
      const valArr = R.filter(x => x > 0, objList[key]);
      if (valArr.length !== new Set(valArr).size) {
        return true;
      }
    }
  }
  return false;
};

const lockCalculation = function* lockCalculation() {
  try {
    const { INCOME_CALCULATOR: incomeCalculator } = componentTypes;
    const currentChecklistType = yield select(taskSelectors.getCurrentChecklistType);
    const checklistType = checklistTypes[currentChecklistType];
    const checklistSelectionIsPresent = yield select(taskSelectors.getSelectedChecklistId);
    yield put({ type: SHOW_LOADER });
    const feuwChecklistId = yield select(taskSelectors.getProcessId);
    const consolidatedData = yield select(selectors.getConsolidatedIncome);
    const borrowerInfo = yield select(selectors.getBorrowers);
    const borrowerList = yield select(selectors.getBorrowersList);
    const consolidation = [];
    let summatedBorrData = {};
    if (checklistType === checklistTypes['expense-calculator']) {
      summatedBorrData = yield call(summateValuesForBorrowers, borrowerList);
    } else if (checklistType === checklistTypes['income-calculator']) {
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
    if (checklistType === checklistTypes['income-calculator']) {
      response = yield call(Api.callPost, `/api/cmodnetcoretkams/IncomeFinancial/lock/${loanNumber}`,
        consolidation);
    } else if (checklistType === checklistTypes['expense-calculator']) {
      response = yield call(Api.callPost, `/api/cmodnetcoretkams/ExpenseFinancial/lock/${loanNumber}?loginName=${loginName}`,
        summatedBorrData);
    }
    response = Math.floor(1000 + Math.random() * 9000);
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
          payload: { enable: false, selectedChecklistLock: '' },
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

const updateChecklist = function* updateChecklist(action) {
  const checklistSelectionIsPresent = yield select(taskSelectors.getSelectedChecklistId);
  const rootId = action.payload;

  yield all([
    put(taskActions.getTasks()),
    put(taskActions.getChecklist(checklistSelectionIsPresent)),
  ]);
  const taskObj = 0;
  yield call(Api.put, `/api/task-engine/task/${rootId}`, { value: { ...taskObj } });
  yield call(getTasks);
};

const ficoLockCalculation = function* ficoLockCalculation() {
  try {
    const ficoScore = yield select(selectors.getselectedChecklistFieldData);
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const selectedBorrower = yield select(selectors.getSelectedBorrowerData);
    const selectedBorrowerPosition = parseInt(R.nth(1, R.split('_', selectedBorrower)), 10);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const taskCheckListId = yield select(selectors.getProcessId);
    const data = yield select(selectors.getChecklist);
    const taskData = getTaskFromProcess(data, 'taskBlueprintCode', FICO_SCORE);
    const rootId = R.pathOr('', [0, '_id'], taskData);
    const payload = [{
      loanNbr: loanNumber,
      position: selectedBorrowerPosition,
      userName: userPrincipalName,
      ficoScore,
      evalId: yield select(dashboardSelectors.evalId),
    }];
    const tkamsPayload = [{
      loanNbr: loanNumber,
      position: selectedBorrowerPosition,
      userName: userPrincipalName,
      ficoScore,
    }];
    const response = yield call(Api.callPost, '/api/dataservice/fico/insertFicoDetails', payload);
    const tkamsResponse = yield call(Api.callPost, '/api/tkams/fico/saveFicoData', tkamsPayload);
    const request = { taskCheckListId };
    if ((R.equals((R.propOr(null, 'status', response), 200))) && (R.equals((R.propOr(null, 'status', tkamsResponse), 200)))) {
      const dbResult = yield call(Api.callPost, '/api/financial-aggregator/financecalc/updateTasksInChecklist', request);
      if (R.equals(R.propOr(null, 'status', dbResult), 200)) {
        yield put({
          type: TOGGLE_LOCK_BUTTON,
          payload: { enable: false, selectedChecklistLock: '' },
        });
        yield put({
          type: UPDATE_CHECKLIST_TASKS,
          payload: rootId,
        });
        yield put({ type: FETCH_FICO_TABLE_DATA });
        yield put({
          type: SET_SELECTED_CHECKLIST_DATA,
          payload: '',
        });
      } else {
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: 'Error while updating Checklist. ',
            level: 'Error',
            title: 'Lock Calculation',
          },
        });
      }
    } else {
      yield put({
        type: SET_POPUP_DATA,
        payload: {
          message: 'Error while saving Checklist. Please try after some time. ',
          level: 'Error',
          title: 'Lock Calculation',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        message: 'Error while saving Checklist. Please try after some time. ',
        level: 'Error',
        title: 'Lock Calculation',
      },
    });
  }
};

const assetVerificationLockCalculation = function* assetVerificationLockCalculation() {
  try {
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    let checkFilterResponseData = false;
    const data = yield select(selectors.getChecklist);
    const taskId = yield select(dashboardSelectors.taskId);
    const evalId = yield select(dashboardSelectors.evalId);
    const taskCheckListId = yield select(selectors.getProcessId);
    const feuwChecklistId = yield select(taskSelectors.getProcessId);
    const currentChecklistType = yield select(taskSelectors.getCurrentChecklistType);
    const checklistType = checklistTypes[currentChecklistType];
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const checklistSelectionIsPresent = yield select(taskSelectors.getSelectedChecklistId);
    let assetLockResponse = {};
    yield put({ type: SHOW_LOADER });
    const borrDetails = yield call(Api.callGet, `/api/dataservice/incomeCalc/borrower/${loanNumber}`);
    const borrIdDetails = {};
    borrDetails.map((borr) => {
      if (borr) {
        borrIdDetails[borr.firstName] = borr.borrowerId;
      }
      return null;
    });
    const filterResponseData = R.pathOr(null, ['value', 'assetCalc'], data);
    if (filterResponseData) {
      checkFilterResponseData = checkDuplicate(filterResponseData);
    }
    if (checkFilterResponseData !== true) {
      const assetlockRequest = [];
      // need to change this to more generic to avoid error
      const assetId = Math.floor(1000 + Math.random() * 9000);
      filterResponseData.map((task) => {
        const reqData = Object.keys(task)[0];
        if (task[reqData]) {
          const filterReqData = R.filter(x => R.isNil(x)
            || !R.isEmpty(x) || x > 0, task[reqData]);
          if (filterReqData && !R.isEmpty(filterReqData)) {
            const name = reqData.split('_')[0];
            assetlockRequest.push({
              ...filterReqData,
              borrId: borrIdDetails[name],
              assetId,
              userName: userPrincipalName,
            });
          }
        }
        return null;
      });
      assetLockResponse = yield call(Api.callPost, '/api/dataservice/asset/assetLockCalculation', assetlockRequest);

      if (assetLockResponse) {
        const request = {
          taskId,
          loanNumber,
          evalId,
          userPrincipalName,
          taskCheckListId,
          calcDateTime: new Date(),
          feuwChecklistId,
          checklistType,
          lockId: assetId,
        };
        const dbResult = yield call(Api.callPost, '/api/financial-aggregator/incomeCalc/lock/', request);
        if (R.equals(R.propOr(null, 'status', dbResult), 200)) {
          yield call(fetchIncomeCalcHistory);
          yield put({
            type: SET_POPUP_DATA,
            payload: {
              message: 'Asset Verification is Locked successfully',
              level: 'Success',
              title: 'Lock Calculation',
            },
          });
          yield put({
            type: TOGGLE_LOCK_BUTTON,
            payload: { enable: false, selectedChecklistLock: '' },
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
              message: `Asset Verification Lock failed due to Borrower data discrepency,
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
      }
      if (assetlockRequest) {
        if (assetlockRequest.length > 0) {
          const coBorrowerPresent = assetlockRequest.length >= 2;
          const saveToTkamsPayload = {
            borrower401KBalance: assetlockRequest[0].ira,
            borrowerCheckingAccountBalance: assetlockRequest[0].checkingAccount,
            borrowerSavingAccountBalance: assetlockRequest[0].savingsAccount,
            borrowerStocksBondsOther: assetlockRequest[0].stocks,
            coBorrower401KBalance: coBorrowerPresent ? assetlockRequest[1].ira : 0,
            coBorrowerCheckingAccountBalance: coBorrowerPresent
              ? assetlockRequest[1].checkingAccount : 0,
            coBorrowerSavingAccountBalance: coBorrowerPresent
              ? assetlockRequest[1].savingsAccount : 0,
            coBorrowerStockBondsOther: coBorrowerPresent ? assetlockRequest[1].stocks : 0,
            email: userPrincipalName,
            evalId,
            loanId: loanNumber,
          };
          const saveToTkamsResponse = yield call(Api.callPost, '/api/tkams/asset/saveToTkams', saveToTkamsPayload);
          if (!saveToTkamsResponse.saveStatus) {
            yield put({
              type: SET_POPUP_DATA,
              payload: {
                message: saveToTkamsResponse.errorMessage,
                level: 'Failed',
                title: 'Failed Saving Asset verification details to TKAMS',
              },
            });
          }
        }
      }
    } else {
      yield put({
        type: SET_POPUP_DATA,
        payload: {
          message: 'Duplication found in asset details',
          level: 'Failed',
          title: 'Lock Calculation',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: FAILED,
        status: 'Error while locking Asset.',
      },
    });
  }
  yield put({ type: HIDE_LOADER });
};

const fetchFicoTableData = function* fetchFicoTableData() {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const updatedFicoTableData = yield call(Api.callGet, `/api/dataservice/fico/fico-history/${loanNumber}`);
  yield put({ type: SET_FICO_TABLE_DATA, payload: updatedFicoTableData });
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
function* watchgetAssetLockstatus() {
  yield takeEvery(SET_LOCK_AV, getAssetLockstatus);
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

function* watchfetchBorrowerData() {
  yield takeEvery(FETCH_SELECTED_BORROWER_DATA, fetchBorrowerData);
}

function* watchfetchChecklistFieldData() {
  yield takeEvery(FETCH_SELECTED_CHECKLIST_DATA, fetchChecklistFieldData);
}

function* watchFicoLockCalculation() {
  yield takeEvery(FICO_LOCK_CALCULATION, ficoLockCalculation);
}

function* watchAssetVerificationLockCalculation() {
  yield takeEvery(ASSET_LOCK_CALCULATION, assetVerificationLockCalculation);
}

function* watchFetchFicoTableData() {
  yield takeEvery(FETCH_FICO_TABLE_DATA, fetchFicoTableData);
}

function* watchUpdateChecklistTasks() {
  yield takeEvery(UPDATE_CHECKLIST_TASKS, updateChecklist);
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
    watchfetchBorrowerData(),
    watchfetchChecklistFieldData(),
    watchFicoLockCalculation(),
    watchFetchFicoTableData(),
    watchUpdateChecklistTasks(),
    watchgetAssetLockstatus(),
    watchAssetVerificationLockCalculation(),
  ]);
};

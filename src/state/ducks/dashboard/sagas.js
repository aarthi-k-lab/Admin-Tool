import {
  select,
  take,
  takeEvery,
  all,
  call,
  fork,
  put,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import { actions as tombstoneActions, selectors as tombstoneSelectors } from 'ducks/tombstone/index';
import { actions as commentsActions } from 'ducks/comments/index';
import { selectors as loginSelectors } from 'ducks/login/index';
import {
  actions as widgetActions,
  selectors as widgetSelectors,
} from 'ducks/widgets/index';
import {
  actions as incomeActions,
} from 'ducks/income-calculator/index';
import {
  actions as checklistActions,
  selectors as checklistSelectors,
} from 'ducks/tasks-and-checklist/index';
import { storeDelayCheckList, storeDelayCheckListHistory } from 'ducks/stager/actions';
import * as XLSX from 'xlsx';
import AppGroupName from 'models/AppGroupName';
import EndShift from 'models/EndShift';
import ChecklistErrorMessageCodes from 'models/ChecklistErrorMessageCodes';
import {
  ERROR, SUCCESS, FAILED,
} from 'constants/common';
import { closeWidgets } from 'components/Widgets/WidgetSelects';
import { INCOME_CALCULATOR } from 'constants/widgets';
import { setDisabledWidget } from 'ducks/widgets/actions';
import { CHECK_TASKNAME } from 'constants/trialTask';
import { APPROVAL_TYPE, PRE_APPROVAL_TYPE } from 'constants/fhlmc';
import processExcel from '../../../lib/excelParser';
import {
  GET_EVALCOMMENTS_SAGA, POST_COMMENT_SAGA,
}
  from '../comments/types';
import selectors from './selectors';

import {
  SET_FHLMC_UPLOAD_RESULT,
  SUBMIT_TO_FHLMC,
  SET_COVIUS_TABINDEX,
  STORE_EVALID_RESPONSE,
  INSERT_EVALID,
  END_SHIFT,
  SET_INCENTIVE_TASKCODES,
  GET_NEXT,
  SET_EXPAND_VIEW,
  SET_EXPAND_VIEW_SAGA,
  VALIDATE_DISPOSITION_SAGA,
  SAVE_DISPOSITION_SAGA,
  SAVE_DISPOSITION,
  SAVE_EVALID_LOANNUMBER,
  SUCCESS_END_SHIFT,
  SHOW_LOADER,
  SHOW_SAVING_LOADER,
  HIDE_LOADER,
  HIDE_SAVING_LOADER,
  CHECKLIST_NOT_FOUND,
  TASKS_NOT_FOUND,
  GET_NEXT_ERROR,
  TASKS_FETCH_ERROR,
  AUTO_SAVE_OPERATIONS,
  AUTO_SAVE_TRIGGER,
  SEARCH_LOAN_RESULT,
  SEARCH_LOAN_TRIGGER,
  ASSIGN_LOAN,
  UNASSIGN_LOAN,
  UNASSIGN_LOAN_RESULT,
  ASSIGN_LOAN_RESULT,
  SET_GET_NEXT_STATUS,
  USER_NOTIF_MSG,
  SEARCH_SELECT_EVAL,
  CLEAR_ERROR_MESSAGE,
  SAVE_INVESTOR_EVENTS_DROPDOWN,
  POPULATE_INVESTOR_EVENTS_DROPDOWN,
  // GET_LOAN_ACTIVITY_DETAILS,
  LOAD_TRIALS_SAGA,
  LOAD_TRIALHEADER_RESULT,
  LOAD_TRIALSDETAIL_RESULT,
  LOAD_TRIALLETTER_RESULT,
  SET_TASK_UNDERWRITING,
  SET_TASK_UNDERWRITING_RESULT,
  GETNEXT_PROCESSED,
  PUT_PROCESS_NAME,
  SET_TASK_SENDTO_DOCGEN,
  SET_TASK_SENDTO_DOCSIN,
  SET_TASK_SENDTO_BOOKING,
  SET_RESULT_OPERATION,
  CONTINUE_MY_REVIEW,
  CONTINUE_MY_REVIEW_RESULT,
  COMPLETE_MY_REVIEW_RESULT,
  SET_ENABLE_SEND_BACK_GEN,
  SET_BULK_UPLOAD_RESULT,
  GET_FHLMC_MOD_HISTORY,
  SET_FHLMC_MOD_HISTORY,
  PROCESS_COVIUS_BULK,
  PROCESS_FHLMC_RESOSLVE_BULK,
  SET_ADD_DOCS_IN,
  SET_ADD_BULK_ORDER_RESULT,
  SET_ENABLE_SEND_BACK_DOCSIN,
  SET_ENABLE_SEND_TO_BOOKING,
  SET_ENABLE_SEND_TO_UW,
  SELECT_REJECT_SAGA,
  SELECT_REJECT,
  SEARCH_LOAN_WITH_TASK_SAGA,
  SEARCH_LOAN_WITH_TASK,
  MOD_REVERSAL_REASONS,
  MOD_REVERSAL_DROPDOWN_VALUES,
  POSTMOD_END_SHIFT,
  STORE_EVALID_RESPONSE_ERROR,
  RESOLUTION_DROP_DOWN_VALUES,
  COMPLETE_MY_REVIEW,
  SET_TRIAL_RESPONSE,
  TRIAL_TASK,
  DISABLE_TRIAL_BUTTON,
  PROCESS_FILE,
  SAVE_PROCESSED_FILE,
  SUBMIT_FILE,
  SET_COVIUS_DATA,
  DOWNLOAD_FILE,
  POPULATE_EVENTS_DROPDOWN,
  SAVE_EVENTS_DROPDOWN,
  SEND_TO_FEUW_SAGA,
  SEND_TO_COVIUS,
  DISABLE_SEND_TO_FEUW,
  ASSIGN_BOOKING_LOAN,
  SAVE_EVAL_FOR_WIDGET,
  UNASSIGN_BOOKING_LOAN,
  SAVE_MAIN_CHECKLIST,
  SAVE_TASKID,
  DISABLE_PUSHDATA,
  EVAL_CASE_DETAILS,
  EVAL_ROW_CLICK,
  SET_CASE_DETAILS,
  SET_EVAL_INDEX,
  SET_TOMBSTONE_DATA_FOR_LOANVIEW,
  SAVE_EVAL_LOANVIEW,
  SET_USER_NOTIFICATION,
  DISMISS_USER_NOTIFICATION,
  FETCH_EVAL_CASE,
  GET_ELIGIBLE_DATA,
  SET_EVALID,
  SET_VALID_EVALDATA,
  SET_TRIAL_DISABLE_STAGER_BUTTON,
  CHECK_TRIAL_DISABLE_STAGER_BUTTON,
  SAVE_APPROVAL_DROPDOWN,
  SAVE_PREAPPROVAL_DROPDOWN,
  SUBMIT_TO_BOARDING_TEMPLATE,
  GET_CANCELLATION_REASON,
  SET_CANCELLATION_REASON,
  SET_DISABLE_GENERATE_BOARDING_TEMPLATE,
} from './types';
import DashboardModel from '../../../models/Dashboard';
import { errorTombstoneFetch } from './actions';
import {
  getTasks,
  resetChecklistData,
  storeProcessDetails,
  getHistoricalCheckListData,
} from '../tasks-and-checklist/actions';
import {
  ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS,
  RESET_DATA,
} from '../tasks-and-checklist/types';

import {
  SET_BORROWERS_DATA,
  SET_INCOMECALC_DATA,
} from '../income-calculator/types';
import { selectors as stagerSelectors } from '../stager/index';
import { saveDelayChecklistDataToDB, fetchDelayCheckListHistory } from '../stager/sagas';

const {
  Messages:
  {
    MSG_VALIDATION_SUCCESS,
    MSG_UPDATED_REMEDY,
    MSG_SERVICE_DOWN,
    LEVEL_FAILED,
    MSG_FILE_UPLOAD_FAILURE,
    MSG_FILE_DOWNLOAD_FAILURE,
    MSG_SENDTOCOVIUS_FAILED,
    MSG_SENDTOEVAL_FAILED,
  },
} = DashboardModel;


const setExpandView = function* setExpand() {
  yield put({
    type: SET_EXPAND_VIEW,
  });
};

function* watchSetExpandView() {
  while ((yield take(SET_EXPAND_VIEW_SAGA)) !== null) {
    yield fork(setExpandView);
  }
}

function getGroup(group) {
  return group === DashboardModel.ALL_STAGER ? DashboardModel.POSTMODSTAGER : group;
}

const autoSaveOnClose = function* autoSaveOnClose(taskStatus) {
  try {
    const taskStatusUpdate = R.propOr({}, 'payload', taskStatus);
    const evalId = yield select(selectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const taskId = yield select(selectors.taskId);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    if (taskId) {
      const response = yield call(Api.callPost, `/api/workassign/updateTaskStatus?evalId=${evalId}&assignedTo=${userPrincipalName}&taskStatus=${taskStatusUpdate}&taskId=${taskId}`, {});
      if (response === 'Accepted') {
        yield put({
          type: AUTO_SAVE_TRIGGER,
          payload: 'Task Status Update Success',
        });
      }
    }
  } catch (e) {
    yield put({ type: AUTO_SAVE_TRIGGER });
  }
};

function* watchAutoSave() {
  yield takeEvery(AUTO_SAVE_OPERATIONS, autoSaveOnClose);
}

const fetchEvalComments = function* fetchEvalComments() {
  const loanNumber = yield select(selectors.loanNumber);
  yield put(commentsActions.loadCommentsForEvalsAction({ loanNumber }));
};

const fetchCaseDetails = function* fetchCaseDetails(action) {
  const { evalId, index } = R.propOr('', 'payload', action);
  let caseHistoryResponse = [];
  try {
    const searchLoanResult = yield select(selectors.searchLoanResult);
    const loanId = yield select(selectors.loanNumber);
    const loanNumber = R.isEmpty(searchLoanResult) ? loanId : searchLoanResult.loanNumber;
    const cases = yield call(Api.callPost, `/api/tkams/getEvalDetails/${loanNumber}/${evalId}`, {});
    if (cases != null) {
      caseHistoryResponse = cases.map((item) => {
        const obj = item;
        obj.cardHistoryDetails = !R.isNil(item.cardHistoryDetails)
          ? JSON.parse(item.cardHistoryDetails) : [];
        obj.cardDetails = !R.isNil(item.cardDetails) ? JSON.parse(item.cardDetails) : [];
        return obj;
      });
      yield put({
        type: SET_CASE_DETAILS,
        payload: caseHistoryResponse,
      });
      yield call(fetchEvalComments);
      yield put({
        type: SET_EVAL_INDEX,
        payload: { index, evalId },
      });
    }
    const checkListHistory = yield call(Api.callGet, `/api/dataservice/delayCheckList/history/${evalId}`);
    if (checkListHistory) {
      yield put(storeDelayCheckListHistory(checkListHistory));
    } else {
      yield put(storeDelayCheckListHistory([]));
    }
  } catch (ex) {
    yield put({
      type: SET_CASE_DETAILS,
      payload: caseHistoryResponse,
    });
  }
};

function* fetchEvalCaseDetails(payload) {
  const loanNumber = R.propOr('', 'payload', payload);
  let evalHistoryResponse = [];
  let sortedcaseDetailsByDesc = [];
  try {
    const evals = yield call(Api.callPost, `/api/tkams/getEvalDetails/${loanNumber}`, {});
    if (evals != null) {
      evalHistoryResponse = evals.map((item) => {
        const obj = item;
        obj.evalHistory = !R.isNil(item.evalHistory) ? JSON.parse(item.evalHistory) : [];
        return obj;
      });
      sortedcaseDetailsByDesc = R.sort(R.descend(R.prop('statusDate')), evalHistoryResponse);
      yield put({
        type: EVAL_CASE_DETAILS,
        payload: sortedcaseDetailsByDesc,
      });
      const response = R.head(sortedcaseDetailsByDesc);
      const action = {
        payload: {
          evalId: response.evalId,
          index: 0,
        },
      };
      yield call(fetchCaseDetails, action);
      yield call(fetchDelayCheckListHistory);
    }
  } catch (ex) {
    yield put({
      type: EVAL_CASE_DETAILS,
      payload: sortedcaseDetailsByDesc,
    });
  }
}

const searchLoan = function* searchLoan(loanNumber) {
  const searchLoanNumber = R.propOr({}, 'payload', loanNumber);
  const wasSearched = yield select(selectors.wasSearched);
  const inProgress = yield select(selectors.inProgress);

  if (!wasSearched && !inProgress) {
    yield put({ type: SHOW_LOADER });
  }
  if (!wasSearched) {
    try {
      const response = yield call(Api.callGet, `/api/data-aggregator/search/loan/${searchLoanNumber}`, {});
      if (response !== null) {
        yield put({
          type: SEARCH_LOAN_RESULT,
          payload: response,
        });
        yield put({
          type: GET_EVALCOMMENTS_SAGA,
          payload: { loanNumber: searchLoanNumber },
        });
      } else {
        yield put({
          type: SEARCH_LOAN_RESULT,
          payload: { statusCode: 404 },
        });
      }
      const openWidgetList = yield select(widgetSelectors.getOpenWidgetList);
      const widgetsToBeClosed = {
        openWidgetList,
        page: 'SEARCH',
        closingWidgets: openWidgetList,
      };
      const payload = {
        currentWidget: '',
        openWidgetList: closeWidgets(widgetsToBeClosed),
      };
      yield put(widgetActions.widgetToggle(payload));
    } catch (e) {
      yield put({
        type: SEARCH_LOAN_RESULT,
        payload: { loanNumber: searchLoanNumber, valid: false },
      });
    }
  }
};

function* checkTrialEnable() {
  const searchLoanResult = yield select(selectors.searchLoanResult);
  const evalId = yield select(selectors.evalId);
  const { assigned, unAssigned } = searchLoanResult;
  const allLoans = R.concat(assigned, unAssigned);
  const selectedLoans = allLoans && allLoans.filter(e => e.evalId === evalId && CHECK_TASKNAME.some(el => e.taskName.includes(el)) && e.tstatus === 'Active');
  let value = false;
  if (selectedLoans && selectedLoans.length > 1) {
    value = true;
  }
  yield put({
    type: SET_TRIAL_DISABLE_STAGER_BUTTON,
    payload: value,
  });
}

function* onSelectReject(payload) {
  const {
    evalId, userID, eventName, loanNumber,
  } = payload.payload;
  const response = yield call(Api.callPost, `/api/workassign/unreject?evalId=${evalId}&userID=${userID}&eventName=${eventName}`, {});
  let rejectResponse = {};
  if (response === null) {
    rejectResponse = {
      message: 'Service Down. Please try again...',
      level: ERROR,
    };
    yield put({
      type: SELECT_REJECT,
      payload: rejectResponse,
    });
  } else if (response.isActionSuccess) {
    rejectResponse = {
      message: response.message,
      level: SUCCESS,
    };
    yield put({
      type: SELECT_REJECT,
      payload: rejectResponse,
    });
  } else {
    rejectResponse = {
      message: response.message,
      level: ERROR,
    };
    yield put({
      type: SELECT_REJECT,
      payload: rejectResponse,
    });
  }
  if (response.isActionSuccess) {
    const searchPayload = { payload: loanNumber };
    yield call(searchLoan, searchPayload);
  }
}

function* onSearchWithTask(payload) {
  const {
    rowData,
    loadSearchedLoan,
  } = payload.payload;
  yield put({ type: SHOW_LOADER });
  try {
    const checklistResponse = yield call(Api.callPost, '/api/dataservice/api/tasks/checklistDetails', [rowData.TKIID]);
    const bpmTaskDetail = yield call(Api.callGet, `/api/bpm-audit/audit/task/${rowData.TKIID}`, {});
    let checklistDetail = R.head(checklistResponse);
    checklistDetail = checklistDetail || {};
    if (bpmTaskDetail) {
      rowData.taskCheckListId = checklistDetail.taskCheckListId;
      rowData.taskCheckListTemplateName = checklistDetail.taskCheckListTemplateName;
      rowData.taskIterationCounter = bpmTaskDetail.currentTaskIterationCounter;
      rowData.taskName = bpmTaskDetail.taskName;
      rowData.taskStatus = bpmTaskDetail.currentStatus;
      rowData.PID = bpmTaskDetail.processId;
      if (rowData['Assigned To']) {
        rowData['Assigned To'] = rowData['Assigned To'].startsWith('cmod-') ? 'In Queue' : rowData['Assigned To'];
      }
      yield put({
        type: SEARCH_LOAN_WITH_TASK,
        payload: rowData,
      });
    } else {
      yield put({
        type: SEARCH_LOAN_WITH_TASK,
        payload: { statusCode: 404 },
      });
    }
  } catch (e) {
    yield put({
      type: SEARCH_LOAN_WITH_TASK,
      payload: { loanNumber: rowData['Loan Number'], valid: false },
    });
  }
  yield call(loadSearchedLoan);
  yield put({ type: HIDE_LOADER });
}

function* watchSearchLoan() {
  yield takeEvery(SEARCH_LOAN_TRIGGER, searchLoan);
}

function* errorFetchingChecklistDetails() {
  yield put({ type: ERROR_LOADING_CHECKLIST });
  yield put({ type: ERROR_LOADING_TASKS });
}

function* fetchChecklistDetails(checklistId) {
  try {
    const groupName = yield select(selectors.groupName);
    const group = getGroup(groupName);
    const taskId = yield select(selectors.getBookingTaskId);
    if (R.equals(group, 'BOOKING')) {
      const response = yield call(Api.callGet, `/api/dataservice/api/getLsamsResponseByTaskId?taskId=${taskId}`);
      yield put({ type: DISABLE_PUSHDATA, payload: response });
    }

    const isChecklistIdInvalid = R.isNil(checklistId) || R.isEmpty(checklistId);
    if (isChecklistIdInvalid) {
      yield put({
        type: CHECKLIST_NOT_FOUND,
        payload: {
          messageCode: ChecklistErrorMessageCodes.NO_CHECKLIST_ID_PRESENT,
        },
      });
      return;
    }
    const response = yield call(Api.callGet, `/api/task-engine/process/${checklistId}?shouldGetTaskTree=false&forceNoCache=${Math.random()}`);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    } else {
      yield put({
        type: USER_NOTIF_MSG,
        payload: {},
      });
      yield put({
        type: SET_GET_NEXT_STATUS,
        payload: false,
      });
    }
    const { rootId: rootTaskId } = response;
    yield put(storeProcessDetails(checklistId, rootTaskId));
    yield put(getTasks());
  } catch (e) {
    yield put({
      type: CHECKLIST_NOT_FOUND,
      payload: {
        messageCode: ChecklistErrorMessageCodes.CHECKLIST_FETCH_FAILED,
      },
    });
  }
}

function* fetchChecklistDetailsForSearchResult(checklistId) {
  yield call(fetchChecklistDetails, checklistId);
}

function* getResolutionDataForEval(evalId) {
  try {
    const response = yield call(Api.callGet, `/api/tkams/fetchResolutionIds/${evalId}`);
    if (!R.isNil(response) && !R.isEmpty(response)) {
      yield put({ type: RESOLUTION_DROP_DOWN_VALUES, payload: response });
    }
  } catch (err) {
    yield put({ type: RESOLUTION_DROP_DOWN_VALUES, payload: {} });
  }
}

function* fetchChecklistDetailsForAssign(groupName, response) {
  if (!AppGroupName.hasChecklist(groupName)) {
    return;
  }
  yield put(resetChecklistData());
  yield put({
    type: CLEAR_ERROR_MESSAGE,
    payload: {},
  });
  const checklistId = R.pathOr('', ['taskData', 'taskCheckListId'], response);
  yield call(fetchChecklistDetails, checklistId);
}


function* selectEval(searchItem) {
  const evalDetails = R.propOr({}, 'payload', searchItem);
  const { taskId: bookingTaskId } = evalDetails;
  yield put({ type: SAVE_TASKID, payload: bookingTaskId });
  let taskCheckListId = R.pathOr('', ['payload', 'taskCheckListId'], searchItem);
  const incomeCalcData = R.propOr(null, 'incomeCalcData', evalDetails);
  yield put(incomeActions.resetIncomeChecklistData());
  yield put(widgetActions.resetWidgetData());
  if (R.pathOr(false, ['incomeCalcData', 'taskCheckListId'], evalDetails)) {
    yield put({ type: SET_INCOMECALC_DATA, payload: incomeCalcData });
    yield put({ type: SET_BORROWERS_DATA, payload: R.propOr(null, 'borrowerData', incomeCalcData) });
  }
  if (!R.propOr(false, 'hasIncomeCalcForProcess', evalDetails)) {
    yield put(setDisabledWidget({ disabledWidgets: [INCOME_CALCULATOR] }));
  }
  yield put(resetChecklistData());
  const user = yield select(loginSelectors.getUser);
  const { userDetails } = user;
  const appGroupName = yield select(selectors.groupName);
  evalDetails.assignee = evalDetails.assignee === 'In Queue' ? null : evalDetails.assignee;
  evalDetails.isAssigned = false;
  let assignedTo = userDetails.email ? userDetails.email.toLowerCase().split('@')[0].split('.').join(' ') : null;
  if (appGroupName === DashboardModel.BOOKING && evalDetails.piid != null) {
    const taskId = `${evalDetails.loanNumber}_${evalDetails.evalId}`;
    const assignmentData = yield call(Api.callGet, `/api/dataservice/api/taskInfo/${taskId}`);
    if (assignmentData && assignmentData.wfTaskId) {
      const { assignedTo: assignee, taskStatus } = assignmentData;
      evalDetails.assignee = taskStatus === 'Assigned' || taskStatus === 'Paused' ? assignee : null;
      evalDetails.taskStatus = taskStatus;
      const { taskCheckListId: checklistId } = assignmentData;
      taskCheckListId = checklistId;
      assignedTo = userDetails.email;
    } else {
      evalDetails.assignee = null;
      taskCheckListId = null;
    }
    evalDetails.taskId = taskId;
  }
  evalDetails.showContinueMyReview = !R.isNil(evalDetails.assignee)
    && assignedTo.toLowerCase() === evalDetails.assignee.toLowerCase();

  yield put({ type: SAVE_EVALID_LOANNUMBER, payload: evalDetails });
  if (R.equals(evalDetails.milestone, 'Pending Booking') || R.equals(evalDetails.milestone, 'Post Mod')) {
    const groupList = R.pathOr([], ['groupList'], user);
    const payload = {
      taskId: `${evalDetails.loanNumber}_${evalDetails.evalId}`,
      taskName: 'Pending Booking',
      groupList,
      appGroupName: 'BOOKING',
    };
    let response;
    if (!taskCheckListId) {
      response = yield call(Api.callPost, '/api/workassign/generateNewChecklist', payload);
    }
    if (response) {
      const { taskCheckListId: checkListId } = response;
      taskCheckListId = checkListId;
    }
  }
  yield call(fetchChecklistDetailsForSearchResult, taskCheckListId);
  yield put(getHistoricalCheckListData(evalDetails.taskId));
  if (R.equals(appGroupName, 'BOOKING')) {
    yield call(getResolutionDataForEval, evalDetails.evalId);
  }
  // fetch loan activity details from api
  // if (R.equals(evalDetails.taskName, 'Trial Modification')
  //  || R.equals(evalDetails.taskName, 'Forbearance')) {
  //   yield call(fetchLoanActivityDetails, searchItem);
  // }
  try {
    yield put(tombstoneActions.fetchTombstoneData(evalDetails.loanNumber,
      evalDetails.taskName, evalDetails.taskId));
  } catch (e) {
    yield put({ type: HIDE_LOADER });
  }
}

function* setTombstoneDataForLoanview(searchItem) {
  const evalDetails = R.propOr({}, 'payload', searchItem);
  const { taskId: bookingTaskId } = evalDetails;
  yield put({ type: SAVE_TASKID, payload: bookingTaskId });
  yield put(resetChecklistData());
  const user = yield select(loginSelectors.getUser);
  const { userDetails } = user;
  const appGroupName = yield select(selectors.groupName);
  evalDetails.assignee = evalDetails.assignee === 'In Queue' ? null : evalDetails.assignee;
  evalDetails.isAssigned = false;
  let assignedTo = userDetails.email ? userDetails.email.toLowerCase().split('@')[0].split('.').join(' ') : null;
  if (appGroupName === DashboardModel.BOOKING && evalDetails.piid != null) {
    const taskId = `${evalDetails.loanNumber}_${evalDetails.evalId}`;
    const assignmentData = yield call(Api.callGet, `/api/dataservice/api/taskInfo/${taskId}`);
    if (assignmentData && assignmentData.wfTaskId) {
      const { assignedTo: assignee, taskStatus } = assignmentData;
      evalDetails.assignee = taskStatus === 'Assigned' || taskStatus === 'Paused' ? assignee : null;
      evalDetails.taskStatus = taskStatus;
      assignedTo = userDetails.email;
    } else {
      evalDetails.assignee = null;
    }
    evalDetails.taskId = taskId;
  }
  evalDetails.showContinueMyReview = !R.isNil(evalDetails.assignee)
    && assignedTo.toLowerCase() === evalDetails.assignee.toLowerCase();

  yield put({ type: SAVE_EVAL_LOANVIEW, payload: evalDetails });
  try {
    yield put(tombstoneActions.fetchTombstoneData(evalDetails.loanNumber,
      evalDetails.taskName, evalDetails.taskId));
  } catch (e) {
    yield put({ type: HIDE_LOADER });
  }
}

function* assignBookingLoan() {
  try {
    yield put({ type: SHOW_LOADER });
    const evalId = yield select(selectors.evalId);
    const loanNumber = yield select(selectors.loanNumber);
    const isAssigned = yield select(selectors.isAssigned);
    const processId = yield select(selectors.processId);
    const groupName = yield select(selectors.groupName);
    const rootTaskId = yield select(checklistSelectors.getRootTaskId);
    const selectedChecklistId = yield select(checklistSelectors.getProcessId);
    const user = yield select(loginSelectors.getUser);
    const userGroups = R.pathOr([], ['groupList'], user);
    const taskId = `${loanNumber}_${evalId}`;
    let evalDetails = {
      taskId,
      loanNumber,
      evalId,
      processId,
    };
    yield put({ type: SAVE_MAIN_CHECKLIST, payload: { rootTaskId, selectedChecklistId } });
    let response;
    if (isAssigned) {
      const userPrincipalName = R.path(['userDetails', 'email'], user);
      const processStatus = yield select(selectors.processStatus);
      const group = getGroup(groupName);
      const taskName = 'Pending Booking';
      response = yield call(Api.callPost, `/api/workassign/assignBookingLoan?evalId=${evalId}&assignedTo=${userPrincipalName}&loanNumber=${loanNumber}&processId=${processId}&processStatus=${processStatus}&groupName=${group}&userGroups=${userGroups}&taskName=${taskName}`, {});
      evalDetails = {
        evalId: response.taskData.evalId,
        loanNumber: response.taskData.loanNumber,
        taskId: response.taskData.taskId,
        processId: response.taskData.wfProcessId,
        processStatus: response.taskData.processStatus,
        appgroupName: response.taskData.groupName,
      };
      if (response !== null && !response.statusCode.Warning) {
        yield put({
          type: ASSIGN_LOAN_RESULT,
          payload: response,
        });
        yield call(fetchChecklistDetailsForAssign, groupName, response);
      } else {
        yield put({
          type: ASSIGN_LOAN_RESULT,
          payload: { status: response.status },
        });
      }
    } else {
      let taskCheckListId;
      response = yield call(Api.callGet, `/api/dataservice/api/taskInfo/${taskId}`);
      if (response && response.wfTaskId) {
        const { assignedTo: assignee, taskStatus } = response;
        evalDetails.assignee = taskStatus === 'Assigned' || taskStatus === 'Paused' ? assignee : null;
        evalDetails.taskStatus = taskStatus;
        const { taskCheckListId: checklistId } = response;
        taskCheckListId = checklistId;
      } else {
        evalDetails.assignee = null;
        taskCheckListId = null;
      }
      evalDetails.taskId = taskId;
      if (!taskCheckListId) {
        const payload = {
          taskId: `${evalDetails.loanNumber}_${evalDetails.evalId}`,
          taskName: 'Pending Booking',
          groupList: userGroups,
          appGroupName: 'BOOKING',
        };
        response = yield call(Api.callPost, '/api/workassign/generateNewChecklist', payload);
        if (response) {
          const { taskCheckListId: checkListId } = response;
          taskCheckListId = checkListId;
        }
      }
      yield put(resetChecklistData());
      yield put({
        type: CLEAR_ERROR_MESSAGE,
        payload: {},
      });
      yield call(fetchChecklistDetails, taskCheckListId);
    }
    yield put({ type: SAVE_EVAL_FOR_WIDGET, payload: evalDetails });
    yield put(getHistoricalCheckListData(taskId));
    yield call(getResolutionDataForEval, evalId);
  } catch (e) {
    yield put({ type: ASSIGN_LOAN_RESULT, payload: { status: MSG_SERVICE_DOWN } });
  }
  yield put({ type: HIDE_LOADER });
}

function* watchTombstoneLoan() {
  yield takeEvery(SEARCH_SELECT_EVAL, selectEval);
}

function* watchLoanviewTombstoneData() {
  yield takeEvery(SET_TOMBSTONE_DATA_FOR_LOANVIEW, setTombstoneDataForLoanview);
}

const continueMyReviewResult = function* continueMyReviewResult(taskStatus) {
  try {
    const taskStatusUpdate = R.propOr({}, 'payload', taskStatus);
    const evalId = yield select(selectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const taskId = yield select(selectors.taskId);
    const appGroupName = yield select(selectors.groupName);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    if (taskId) {
      const response = yield call(Api.callPost, `/api/workassign/updateTaskStatus?evalId=${evalId}&assignedTo=${userPrincipalName}&taskStatus=${taskStatusUpdate}&taskId=${taskId}&appGroupName=${appGroupName}`, {});
      if (response !== null) {
        yield put({
          type: CONTINUE_MY_REVIEW_RESULT,
          payload: true,
        });
      }
    }
  } catch (e) {
    yield put({ type: CONTINUE_MY_REVIEW_RESULT, payload: true });
  }
};

const getCommentPayload = function* buildCommentPayload(comment, disposition) {
  const loanNumber = yield select(selectors.loanNumber);
  const user = yield select(loginSelectors.getUser);
  const groupName = yield select(selectors.groupName);
  const page = DashboardModel.GROUP_INFO.find(pageInstance => pageInstance.group === groupName);
  const eventName = !R.isNil(page) ? page.taskCode : '';
  const taskName = !R.isNil(page) ? page.task : '';
  const taskId = yield select(selectors.taskId);
  const taskIterationCounter = yield select(selectors.taskIterationCounter);
  const processId = yield select(selectors.processId);
  const commentPayload = {
    applicationName: 'CMOD',
    loanNumber,
    processIdType: 'WF_PRCS_ID',
    processId,
    eventName,
    comment,
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
  return commentPayload;
};

function* completeMyReviewResult(action) {
  try {
    const disposition = R.path(['payload'], action);
    const evalId = yield select(selectors.evalId);
    const wfTaskId = yield select(selectors.taskId);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const request = {
      evalId,
      disposition,
      userName: userPrincipalName,
      wfTaskId,
    };
    const response = yield call(Api.callPost, '/api/disposition/cmodDisposition', request);
    yield put({
      type: COMPLETE_MY_REVIEW_RESULT,
      payload: { error: R.has(ERROR, response) },
    });
    const comments = yield select(checklistSelectors.getSLFailureComments);
    yield all(comments.map(function* postcomment(comment) {
      const commentPayload = yield* getCommentPayload(comment, 'Complete My Review');
      yield put({ type: POST_COMMENT_SAGA, payload: commentPayload });
    }));
  } catch (e) {
    yield put({ type: COMPLETE_MY_REVIEW_RESULT, payload: false });
  }
}

function* watchContinueMyReview() {
  yield takeEvery(CONTINUE_MY_REVIEW, continueMyReviewResult);
}

function* watchCompleteMyReview() {
  yield takeEvery(COMPLETE_MY_REVIEW, completeMyReviewResult);
}

const validateDisposition = function* validateDiposition(dispositionPayload) {
  try {
    yield put({ type: SHOW_SAVING_LOADER });
    const payload = R.propOr({}, 'payload', dispositionPayload);
    const disposition = R.propOr({}, 'dispositionReason', payload);
    const groupName = R.propOr({}, 'group', payload);
    const isAuto = R.propOr(false, 'isAuto', payload);
    const evalId = yield select(selectors.evalId);
    const wfTaskId = yield select(selectors.taskId);
    const assigneeName = yield select(checklistSelectors.getAgentName);
    const wfProcessId = yield select(selectors.processId);
    const processStatus = yield select(selectors.processStatus);
    const validateAgent = !R.isNil(assigneeName) && !R.isEmpty(assigneeName);
    const request = {
      evalId,
      disposition,
      groupName,
      validateAgent,
      assigneeName,
      wfTaskId,
      wfProcessId,
      processStatus,
    };
    const response = yield call(Api.callPost, `/api/disposition/validate-disposition?isAuto=${isAuto}`, request);
    const { tkamsValidation, skillValidation } = response;
    yield put({
      type: SET_GET_NEXT_STATUS,
      payload: tkamsValidation.enableGetNext && (!validateAgent || skillValidation.result),
    });
    if (!tkamsValidation.enableGetNext) {
      yield put({
        type: USER_NOTIF_MSG,
        payload: {
          type: ERROR,
          data: tkamsValidation.discrepancies,
        },
      });
    } else {
      let message = isAuto ? MSG_UPDATED_REMEDY : MSG_VALIDATION_SUCCESS;
      let type = SUCCESS;
      if (validateAgent) {
        type = skillValidation.result ? SUCCESS : ERROR;
        ({ message } = skillValidation);
      }
      yield put({
        type: USER_NOTIF_MSG,
        payload: {
          type,
          msg: message,
        },
      });
    }
  } catch (e) {
    yield put({ type: HIDE_SAVING_LOADER });
  }
};

const saveDisposition = function* setDiposition(dispositionPayload) {
  try {
    yield put({ type: SHOW_SAVING_LOADER });
    const payload = R.propOr({}, 'payload', dispositionPayload);
    const disposition = R.propOr({}, 'dispositionReason', payload);
    const group = R.propOr({}, 'group', payload);
    const evalId = yield select(selectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const taskId = yield select(selectors.taskId);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const response = yield call(Api.callPost, `/api/disposition/disposition?evalCaseId=${evalId}&disposition=${disposition}&assignedTo=${userPrincipalName}&taskId=${taskId}&group=${group}`, {});
    yield put({
      type: SAVE_DISPOSITION,
      payload: response,
    });
    yield put(checklistActions.validationDisplayAction(true));
    yield put({ type: HIDE_SAVING_LOADER });
  } catch (e) {
    yield put({ type: HIDE_SAVING_LOADER });
  }
};

function* watchDispositionSave() {
  let payload;
  while (true) {
    payload = yield take(SAVE_DISPOSITION_SAGA);
    if (payload) {
      yield fork(saveDisposition, payload);
    }
  }
}

function* watchValidateDispositon() {
  let payload;
  while (true) {
    payload = yield take(VALIDATE_DISPOSITION_SAGA);
    if (payload) {
      yield fork(validateDisposition, payload);
    }
  }
}

function getLoanNumber(taskDetails) {
  return R.path(['taskData', 'data', 'loanNumber'], taskDetails);
}

function getEvalId(taskDetails) {
  return R.path(['taskData', 'data', 'applicationId'], taskDetails);
}

function getProcessId(taskDetails) {
  let value = R.path(['taskData', 'data', 'piid'], taskDetails);
  if (value === undefined) {
    value = R.path(['taskData', 'data', 'wfProcessId'], taskDetails);
  }
  return value;
}

function getChecklistId(taskDetails) {
  return R.pathOr('', ['taskData', 'data', 'taskCheckListId'], taskDetails);
}

function getEvalPayload(taskDetails) {
  const loanNumber = getLoanNumber(taskDetails);
  const evalId = getEvalId(taskDetails);
  const taskId = R.path(['taskData', 'data', 'id'], taskDetails);
  const taskIterationCounter = R.path(['taskData', 'data', 'taskIterationCounter'], taskDetails);
  const piid = getProcessId(taskDetails);
  const brand = R.path(['taskData', 'data', 'brand'], taskDetails);
  const investorCode = R.path(['taskData', 'data', 'investorCode'], taskDetails);
  return {
    loanNumber,
    evalId,
    taskId,
    taskIterationCounter,
    piid,
    brand,
    investorCode,
  };
}

function getCommentPayloadFromTaskDetails(taskDetails) {
  const loanNumber = getLoanNumber(taskDetails);
  const processId = getProcessId(taskDetails);
  const evalId = getEvalId(taskDetails);
  const taskId = R.path(['taskData', 'data', 'id'], taskDetails);
  return {
    applicationName: 'CMOD',
    processIdType: 'WF_PRCS_ID',
    loanNumber,
    processId,
    evalId,
    taskId,
  };
}

function* saveIncentiveAmount(taskObject, taskId, processId, taskCodeValues) {
  try {
    if (!R.isNil(taskObject.value)) {
      const payload = {
        dataPointName: R.contains(taskObject.taskBlueprintCode, taskCodeValues.incentiveRequiredTaskCodes) ? 'Incentive Required' : 'Incentive Received',
        dataPointUOM: 'Dollar',
        dataPointValue: taskObject.value,
        valueEnteredByUser: 'CMOD',
        valueEnteredDateTime: new Date().toISOString(),
        wfProcessId: processId,
        wfTaskId: taskId,
      };
      const incentiveSaveResponse = yield call(Api.callPost, '/api/dataservice/api/taskmiscdata', payload);
      if (!R.isNil(incentiveSaveResponse)) {
        yield put({
          type: USER_NOTIF_MSG,
          payload: {
            type: SUCCESS,
            msg: 'Saved Data Successfully',
          },
        });
      }
    }
  } catch (e) {
    yield put({
      type: USER_NOTIF_MSG,
      payload: {
        type: ERROR,
        data: 'Error in Saving data',
      },
    });
  }
}

function* savePostModChklistDisposition(payload) {
  const user = yield select(loginSelectors.getUser);
  const userPrincipalName = R.path(['userDetails', 'email'], user);
  const taskId = yield select(selectors.taskId);
  const evalId = yield select(selectors.evalId);
  const processId = yield select(selectors.processId);
  const disposition = payload.dispositionCode;
  try {
    if (!payload.isFirstVisit) {
      const checklistId = yield select(checklistSelectors.getProcessId);
      const configResponse = yield call(Api.callGet, '/api/config');
      const { incentive } = configResponse;
      yield put({
        type: SET_INCENTIVE_TASKCODES,
        payload: incentive,
      });
      const taskCodeValues = yield select(selectors.incentiveTaskCodes);
      const taskPayload = {
        taskCodes: taskCodeValues.incentiveRequiredTaskCodes
          .concat(taskCodeValues.incentiveReceivedTaskCodes),
      };
      const response = yield call(Api.callPost, `/api/task-engine/task/getTaskCodeValues/${checklistId}`, taskPayload);
      const activeIncentiveTask = [];
      response.forEach((object) => {
        if (!R.isNil(object.value)) {
          activeIncentiveTask.push(object);
        }
      });
      yield all(activeIncentiveTask.map((taskObject => call(saveIncentiveAmount, taskObject,
        taskId, processId, taskCodeValues))));
      const saveResponse = yield call(Api.callPost, `/api/disposition/stager?evalId=${evalId}&userId=${userPrincipalName}&taskId=${taskId}&disposition=${disposition}`);
      yield put({
        type: SET_GET_NEXT_STATUS,
        payload: R.isEmpty(saveResponse.getNextTaskResponse.userMessage),
      });
      yield put({
        type: USER_NOTIF_MSG,
        payload: {
          type: SUCCESS,
          msg: 'Dispositioned Successfully',
        },
      });
    }
  } catch (e) {
    yield put({
      type: USER_NOTIF_MSG,
      payload: {
        type: ERROR,
        data: 'Error in disposition',
      },
    });
    return false;
  }
  return true;
}

function* saveGeneralChecklistDisposition(payload) {
  const { appGroupName } = payload;
  if (!payload.isFirstVisit
    && AppGroupName.hasChecklist(appGroupName)) {
    const evalId = yield select(selectors.evalId);
    const groupName = payload.appGroupName;
    const skipValidation = DashboardModel.checkSkipValidation(groupName);
    const agentName = yield select(checklistSelectors.getAgentName);
    const wfTaskId = yield select(selectors.taskId);
    const wfProcessId = yield select(selectors.processId);
    const processStatus = yield select(selectors.processStatus);
    const loanNumber = yield select(selectors.loanNumber);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const validateAgent = !R.isNil(agentName) && !R.isEmpty(agentName);
    let assigneeUserGroups = '';
    let managerID = null;
    if (validateAgent) {
      managerID = userPrincipalName;
      const assignees = yield select(checklistSelectors.getDropDownOptions);
      const selectedAssignee = R.head(R.filter(
        assignee => assignee.userPrincipalName === agentName, assignees,
      ));
      assigneeUserGroups = selectedAssignee.appGroups;
    }
    const disposition = payload.dispositionCode;
    const request = {
      evalId,
      disposition,
      groupName,
      validateAgent,
      userName: userPrincipalName,
      assigneeName: agentName,
      wfTaskId,
      wfProcessId,
      processStatus,
      loanNumber,
      managerID,
      userGroups: assigneeUserGroups,
      skipValidation,
    };
    const saveResponse = yield call(Api.callPost, '/api/disposition/checklistDisposition', request);
    const { tkamsValidation, skillValidation } = saveResponse;
    yield put({
      type: SET_GET_NEXT_STATUS,
      payload: skipValidation
        || (tkamsValidation.enableGetNext && (!validateAgent || skillValidation.result)),
    });
    if (!skipValidation && !tkamsValidation.enableGetNext) {
      yield put({ type: HIDE_LOADER });
      yield put({
        type: USER_NOTIF_MSG,
        payload: {
          type: ERROR,
          data: tkamsValidation.discrepancies,
        },
      });
      return false;
    }
    let message = MSG_VALIDATION_SUCCESS;
    let type = SUCCESS;
    if (validateAgent) {
      type = skillValidation.result ? SUCCESS : ERROR;
      ({ message } = skillValidation);
    }
    yield put({
      type: USER_NOTIF_MSG,
      payload: {
        type,
        msg: message,
      },
    });
  }
  return true;
}

function* fetchChecklistDetailsForGetNext(taskDetails, payload) {
  const { appGroupName } = payload;
  const group = getGroup(appGroupName);
  if (!AppGroupName.hasChecklist(group)) {
    return;
  }
  const checklistId = getChecklistId(taskDetails);
  yield call(fetchChecklistDetails, checklistId);
}

function* getNext(action) {
  try {
    yield put({ type: SHOW_LOADER });
    yield put({ type: GETNEXT_PROCESSED, payload: false });
    const groupName = yield select(selectors.groupName);
    const group = getGroup(groupName);
    const stagerTaskName = yield select(selectors.stagerTaskName);
    const brand = (yield select(loginSelectors.isRPSGroupPresent)) ? 'RPS' : 'NSM';
    if (group === DashboardModel.UWSTAGER && stagerTaskName.activeTile === 'Delay Checklist') {
      yield put(checklistActions.validationDisplayAction(false));
      yield call(saveDelayChecklistDataToDB);
      const data = yield select(stagerSelectors.getDelayCheckList);
      if (!data) {
        yield put({ type: HIDE_LOADER });
        yield put(checklistActions.validationDisplayAction(true));
        return;
      }
      yield put(storeDelayCheckList(null));
    }
    const saveChecklistDisposition = (group === DashboardModel.POSTMODSTAGER
      || group === DashboardModel.UWSTAGER)
      ? savePostModChklistDisposition : saveGeneralChecklistDisposition;
    if (yield call(saveChecklistDisposition, action.payload)) {
      const allTasksComments = yield select(checklistSelectors.getTaskComment);
      const dispositionComment = yield select(checklistSelectors.getDispositionComment);
      if (dispositionComment) {
        yield put({ type: POST_COMMENT_SAGA, payload: dispositionComment });
      }
      yield put(resetChecklistData());
      const user = yield select(loginSelectors.getUser);
      const userPrincipalName = R.path(['userDetails', 'email'], user);
      const groupList = R.pathOr([], ['groupList'], user);
      let postmodtaskName = '';
      if (group === DashboardModel.POSTMODSTAGER || group === DashboardModel.UWSTAGER) {
        const taskName = action.payload.activeTile || stagerTaskName.activeTile;
        postmodtaskName = (taskName === 'Recordation' || taskName === 'Delay Checklist')
          ? `${taskName}-${(action.payload.activeTab || stagerTaskName.activeTab).replace(/ /g, '')}` : taskName;
      }
      const taskDetails = yield call(Api.callGet, `api/workassign/getNext?appGroupName=${group}&userPrincipalName=${userPrincipalName}&userGroups=${groupList}&taskName=${postmodtaskName}&brand=${brand}`);
      const taskId = R.pathOr(null, ['taskData', 'data', 'id'], taskDetails);
      const bookingTaskId = R.pathOr(null, ['taskData', 'data', 'bookingTaskId'], taskDetails);
      const incomeCalcData = R.propOr(null, 'incomeCalcData', taskDetails);
      if (R.pathOr(false, ['incomeCalcData', 'taskCheckListId'], taskDetails)) {
        yield put({ type: SET_INCOMECALC_DATA, payload: incomeCalcData });
      }
      if (!R.pathOr(false, ['incomeCalcData', 'hasIncomeCalcForProcess'], taskDetails)) {
        yield put(setDisabledWidget({ disabledWidgets: [INCOME_CALCULATOR] }));
      }
      yield put(getHistoricalCheckListData(taskId));
      if (R.keys(allTasksComments).length) {
        yield all(R.keys(allTasksComments).map((taskComment) => {
          if (R.keys(allTasksComments[taskComment]).length) {
            return put(commentsActions.postCommentAction(allTasksComments[taskComment]));
          }
          return null;
        }));
      }
      if (!R.isNil(R.path(['taskData', 'data'], taskDetails))) {
        const loanNumber = getLoanNumber(taskDetails);
        const evalPayload = getEvalPayload(taskDetails);
        const commentsPayLoad = getCommentPayloadFromTaskDetails(taskDetails);
        const { taskName } = taskDetails.taskData.data;
        if (R.equals(group, 'BOOKING')) {
          yield call(getResolutionDataForEval, getEvalId(taskDetails));
        }
        yield call(fetchChecklistDetailsForGetNext, taskDetails, action.payload);
        yield put({ type: SAVE_EVALID_LOANNUMBER, payload: evalPayload });
        yield put({ type: SAVE_TASKID, payload: bookingTaskId });
        yield put(tombstoneActions.fetchTombstoneData(loanNumber, taskName, taskId));
        yield put(commentsActions.loadCommentsAction(commentsPayLoad));
        yield put({ type: HIDE_LOADER });
      } else if (!R.isNil(R.path(['messsage'], taskDetails))) {
        yield put({ type: TASKS_NOT_FOUND, payload: { noTasksFound: true } });
        yield put(errorTombstoneFetch());
        yield call(errorFetchingChecklistDetails);
      } else if (!R.isNil(R.path(['getNextError'], taskDetails))) {
        yield put({
          type: GET_NEXT_ERROR,
          payload: { isGetNextError: true, getNextError: taskDetails.getNextError },
        });
        yield put(errorTombstoneFetch());
        yield call(errorFetchingChecklistDetails);
      } else {
        yield put({ type: TASKS_FETCH_ERROR, payload: { taskfetchError: true } });
        yield put(errorTombstoneFetch());
        yield call(errorFetchingChecklistDetails);
      }
    }
    yield put({ type: HIDE_LOADER });
  } catch (e) {
    yield put({ type: TASKS_FETCH_ERROR, payload: { taskfetchError: true } });
    yield put(errorTombstoneFetch());
    yield call(errorFetchingChecklistDetails);
    yield put({ type: HIDE_LOADER });
  } finally {
    yield put({ type: GETNEXT_PROCESSED, payload: true });
  }
}

function* watchGetNext() {
  yield takeEvery(GET_NEXT, getNext);
}

/**
 * @description
 * This function is called for two reasons:
 *  1. To simply clear the dashboard data when navigating between the left pane icons
 *  2. When the user clicks 'End Shift' button present in the dashboard
 * @param {*} action
 */
// eslint-disable-next-line
function* endShift(action) {
  const type = R.pathOr('', ['payload', 'type'], action);
  if (type === EndShift.CLEAR_DASHBOARD_DATA) {
    yield put({ type: SUCCESS_END_SHIFT });
    yield put(checklistActions.emptyDispositionComment(null));
    return;
  }
  const groupName = yield select(selectors.groupName);
  const group = getGroup(groupName);
  if (AppGroupName.hasChecklist(group)) {
    yield put({ type: SHOW_LOADER });
    const payload = {};
    payload.appGroupName = group;
    payload.isFirstVisit = yield select(selectors.isFirstVisit);
    payload.dispositionCode = yield select(checklistSelectors.getDispositionCode);
    const stagerTaskName = yield select(selectors.stagerTaskName);
    if (group === DashboardModel.UWSTAGER && stagerTaskName.activeTile === 'Delay Checklist') {
      yield put(checklistActions.validationDisplayAction(false));
      yield call(saveDelayChecklistDataToDB);
      const data = yield select(stagerSelectors.getDelayCheckList);
      if (!data) {
        yield put({ type: HIDE_LOADER });
        yield put(checklistActions.validationDisplayAction(true));
        return;
      }
      yield put(storeDelayCheckList(null));
    }
    const saveChecklistDisposition = group === DashboardModel.POSTMODSTAGER
      || group === DashboardModel.UWSTAGER
      ? savePostModChklistDisposition : saveGeneralChecklistDisposition;
    if (yield call(saveChecklistDisposition, payload)) {
      const dispositionComment = yield select(checklistSelectors.getDispositionComment);
      if (dispositionComment) {
        yield put({ type: POST_COMMENT_SAGA, payload: dispositionComment });
      }
      yield put(resetChecklistData());
      if (group === DashboardModel.POSTMODSTAGER || group === DashboardModel.UWSTAGER) {
        yield put({ type: POSTMOD_END_SHIFT });
        return;
      }
      yield put({ type: HIDE_LOADER });
      yield put({ type: SUCCESS_END_SHIFT });
    }
  } else {
    yield put({ type: SUCCESS_END_SHIFT });
  }
}

function* watchEndShift() {
  yield takeEvery(END_SHIFT, endShift);
}

function* unassignLoan() {
  try {
    const evalId = yield select(selectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const taskId = yield select(selectors.taskId);
    const processId = yield select(selectors.processId);
    const processStatus = yield select(selectors.processStatus);
    const loanNumber = yield select(selectors.loanNumber);
    const appgroupName = yield select(selectors.groupName);
    const group = getGroup(appgroupName);
    let taskName = '';
    if (group === DashboardModel.POSTMODSTAGER || group === DashboardModel.UWSTAGER) {
      const stagerTaskName = yield select(selectors.stagerTaskName);
      taskName = (stagerTaskName.activeTile === 'Recordation' || stagerTaskName.activeTile === 'Delay Checklist')
        ? `${stagerTaskName.activeTile}-${stagerTaskName.activeTab.replace(/ /g, '')}` : stagerTaskName.activeTile;
    } else {
      taskName = appgroupName === DashboardModel.BOOKING ? DashboardModel.PENDING_BOOKING : '';
    }
    const response = yield call(Api.callPost, `/api/workassign/unassignLoan?evalId=${evalId}&assignedTo=${userPrincipalName}&loanNumber=${loanNumber}&taskId=${taskId}&processId=${processId}&processStatus=${processStatus}&appgroupName=${appgroupName}&taskName=${taskName}`, {});
    if (response !== null) {
      yield put({
        type: UNASSIGN_LOAN_RESULT,
        payload: response,
      });
    } else {
      yield put({
        type: UNASSIGN_LOAN_RESULT,
        payload: { cmodProcess: { taskStatus: 'ERROR' } },
      });
    }
  } catch (e) {
    yield put({ type: UNASSIGN_LOAN_RESULT, payload: { cmodProcess: { taskStatus: 'ERROR' } } });
  }
}

function* unassignBookingLoan() {
  try {
    yield put({ type: SHOW_LOADER });
    const widgetLoan = yield select(selectors.getWidgetLoan);
    const {
      evalId, taskId, processId, processStatus, loanNumber, appgroupName,
    } = widgetLoan;
    if (!R.isNil(evalId) && !R.isEmpty(evalId)) {
      const user = yield select(loginSelectors.getUser);
      const userPrincipalName = R.path(['userDetails', 'email'], user);
      const taskName = appgroupName === DashboardModel.BOOKING ? DashboardModel.PENDING_BOOKING : '';
      const response = yield call(Api.callPost,
        `/api/workassign/unassignLoan?evalId=${evalId}&assignedTo=${userPrincipalName}&loanNumber=${loanNumber}&taskId=${taskId}&processId=${processId}&processStatus=${processStatus}&appgroupName=${appgroupName}&taskName=${taskName}&isWidgetLoan=true`, {});
      if (response !== null) {
        yield put({ type: RESET_DATA });
        const selectedChecklistId = yield select(selectors.getSelectedChecklistId);
        yield call(fetchChecklistDetails, selectedChecklistId);
      }
    }
  } catch (e) {
    yield put({ type: UNASSIGN_LOAN_RESULT, payload: { cmodProcess: { taskStatus: 'ERROR' } } });
  }
  yield put({ type: HIDE_LOADER });
}

function* watchUnassignLoan() {
  yield takeEvery(UNASSIGN_LOAN, unassignLoan);
}

function* assignLoan() {
  try {
    const evalId = yield select(selectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const taskId = yield select(selectors.taskId);
    const groupName = yield select(selectors.groupName);
    const processId = yield select(selectors.processId);
    const processStatus = yield select(selectors.processStatus);
    const loanNumber = yield select(selectors.loanNumber);
    const userGroups = R.pathOr([], ['groupList'], user);
    const group = getGroup(groupName);
    let taskName = '';
    if (group === DashboardModel.POSTMODSTAGER || group === DashboardModel.UWSTAGER) {
      const stagerTaskName = yield select(selectors.stagerTaskName);
      taskName = (stagerTaskName.activeTile === 'Recordation' || stagerTaskName.activeTile === 'Delay Checklist')
        ? `${stagerTaskName.activeTile}-${stagerTaskName.activeTab.replace(/ /g, '')}` : stagerTaskName.activeTile;
    } else {
      taskName = groupName === DashboardModel.BOOKING ? DashboardModel.PENDING_BOOKING : '';
    }
    const assignLoanUrl = (groupName === DashboardModel.BOOKING) ? 'assignBookingLoan' : 'assignLoan';
    const response = yield call(Api.callPost, `/api/workassign/${assignLoanUrl}?evalId=${evalId}&assignedTo=${userPrincipalName}&loanNumber=${loanNumber}&taskId=${taskId}&processId=${processId}&processStatus=${processStatus}&groupName=${groupName}&userGroups=${userGroups}&taskName=${taskName}`, {});
    const incomeCalcData = R.propOr(null, 'incomeCalcData', response);
    if (R.pathOr(false, ['incomeCalcData', 'taskCheckListId'], response)) {
      yield put({ type: SET_INCOMECALC_DATA, payload: incomeCalcData });
    }
    const disabledWidgets = yield select(widgetSelectors.getDisabledWidgets);
    if (R.equals(true, R.pathOr(false, ['incomeCalcData', 'hasIncomeCalcForProcess'], response))) {
      yield put(setDisabledWidget({
        disabledWidgets: R.without(INCOME_CALCULATOR, disabledWidgets),
      }));
    } else {
      yield put(setDisabledWidget({ disabledWidgets: [INCOME_CALCULATOR] }));
    }

    yield put(getHistoricalCheckListData(taskId));
    if (response !== null && !response.error) {
      yield put({
        type: ASSIGN_LOAN_RESULT,
        payload: response,
      });
      yield call(fetchChecklistDetailsForAssign, groupName, response);
    } else {
      yield put({
        type: ASSIGN_LOAN_RESULT,
        payload: { status: MSG_SERVICE_DOWN },
      });
    }
  } catch (e) {
    yield put({ type: ASSIGN_LOAN_RESULT, payload: { status: MSG_SERVICE_DOWN } });
  }
}

function* loadTrials(payload) {
  const evalId = payload.payload;
  try {
    yield put({ type: SHOW_LOADER });
    const response = yield call(Api.callGet, `/api/cmodtrial/TrialHeaderData?EvalId=${evalId}`);
    if (response !== null) {
      yield put({
        type: LOAD_TRIALHEADER_RESULT,
        payload: response,
      });
    } else {
      yield put({
        type: LOAD_TRIALHEADER_RESULT,
        payload: { statusCode: 404 },
      });
    }
    yield put({ type: HIDE_LOADER });
  } catch (e) {
    yield put({ type: LOAD_TRIALHEADER_RESULT, payload: { e, valid: false } });
  }
  const trialHeader = yield select(selectors.getTrialHeader);
  const isTrialHeader = trialHeader ? trialHeader.trialName : '';
  if (isTrialHeader) {
    yield put({ type: PUT_PROCESS_NAME, payload: isTrialHeader });
    try {
      yield put({ type: SHOW_LOADER });
      const response = yield call(Api.callGet, `/api/cmodtrial/TrialDetailData?EvalId=${evalId}`);
      if (response !== null) {
        yield put({
          type: LOAD_TRIALSDETAIL_RESULT,
          payload: response,
        });
      } else {
        yield put({
          type: LOAD_TRIALSDETAIL_RESULT,
          payload: { statusCode: 404 },
        });
      }
      yield put({ type: HIDE_LOADER });
    } catch (e) {
      yield put({ type: LOAD_TRIALSDETAIL_RESULT, payload: { e, valid: false } });
    }

    try {
      yield put({ type: SHOW_LOADER });
      const response = yield call(Api.callGet, `/api/cmodtrial/LetterData?EvalId=${evalId}`);
      if (response !== null) {
        yield put({
          type: LOAD_TRIALLETTER_RESULT,
          payload: response,
        });
      } else {
        yield put({
          type: LOAD_TRIALLETTER_RESULT,
          payload: { statusCode: 404 },
        });
      }
      yield put({ type: HIDE_LOADER });
    } catch (e) {
      yield put({ type: LOAD_TRIALLETTER_RESULT, payload: { e, valid: false } });
    }

    let evalStatus;
    try {
      yield put({ type: SHOW_LOADER });
      const response = yield call(Api.callGetText, `/api/cmodnetcoretkams/Eval/Status?EvalId=${evalId}`);
      evalStatus = response !== null ? response : '';
      yield put({ type: HIDE_LOADER });
    } catch (e) {
      evalStatus = '';
      yield put({ type: LOAD_TRIALLETTER_RESULT, payload: { e, valid: false } });
    }

    let message = '';
    if (evalStatus !== 'Approved' || trialHeader.resolutionStatus !== 'Closed') {
      message = 'Either the Eval case is not in Approved status or the Resolution case is not in a Closed status in Remedy.'
        + ' If authorized, please click Send to Underwriting button, or update Remedy to appropriate state.';
    }
    yield put({
      type: SET_TASK_UNDERWRITING_RESULT,
      payload: {
        level: ERROR,
        status: message,
      },
    });
  } else {
    yield put({
      type: SET_TASK_UNDERWRITING_RESULT,
      payload: {
        level: ERROR,
        status: 'Either the Eval case is not in Approved status or the Resolution case is not in a Closed status in Remedy.'
          + ' If authorized, please click Send to Underwriting button, or update Remedy to appropriate state.',
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* sentToUnderwriting() {
  const taskId = yield select(selectors.taskId);
  const evalId = yield select(selectors.evalId);
  try {
    yield put({ type: SHOW_LOADER });
    const responseTask = yield call(Api.callGet, `/api/bpm-audit/audit/task/${taskId}`);
    if (responseTask !== null && responseTask.currentStatus && responseTask.currentStatus === 'Received') {
      const response = yield call(Api.callGet, `/api/cmodtrial/ValidateSendToUnderwriting?EvalId=${evalId}`);
      if (response !== null && response.isValid === true && response.evalStatus === 'Active' && response.caseStatus === 'Open') {
        const payload = JSON.parse(`{
              "taskId": "${taskId}", 
              "status": "Send to Underwriting",
              "currentStatus": "Received" 
            }`);
        const responseSend = yield call(Api.callPost, '/api/cmodtrial/SendToUnderwriting', payload);
        const statusCode = R.pathOr(null, ['finishTaskResponse', 'statusCode'], responseSend);
        if (responseSend !== null && statusCode === '200') {
          yield put({
            type: SET_TASK_UNDERWRITING_RESULT,
            payload: {
              level: SUCCESS,
              status: 'Trial has been Sent to Underwriting',
            },
          });
          yield put({
            type: SET_ENABLE_SEND_TO_UW,
            payload: false,
          });
        } else {
          yield put({
            type: SET_TASK_UNDERWRITING_RESULT,
            payload: {
              level: ERROR,
              status: MSG_SERVICE_DOWN,
            },
          });
        }
      } else {
        const message = 'Unable to send back to Underwriting because either eval is not '
          + 'in Active status or Resolution is not in Open status.';
        yield put({
          type: SET_TASK_UNDERWRITING_RESULT,
          payload: {
            level: ERROR,
            status: message,
          },
        });
      }
    } else {
      const message = 'Unable to send back to Underwriting because Trial task is not active.';
      yield put({
        type: SET_TASK_UNDERWRITING_RESULT,
        payload: { level: ERROR, status: message },
      });
    }
  } catch (e) {
    yield put({
      type: SET_TASK_UNDERWRITING_RESULT,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* sendToDocGen(payload) {
  // const taskId = yield select(selectors.taskId);
  const evalId = yield select(selectors.evalId);
  const isStager = payload.payload;
  try {
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    yield put({ type: SHOW_LOADER });
    const response = yield call(Api.callGet, `/api/cmodnetcoretkams/DocGen/DocGen${isStager ? 'Stager' : ''}?EvalId=${evalId}`);
    if (response !== null && response === true) {
      const payload1 = JSON.parse(`{
        "evalid": "${evalId}",
        "eventname": "sendToDocGen${isStager ? 'Stager' : ''}",
        "userID": "${userPrincipalName}"
      }`);
      const responseSend = yield call(Api.callPost, '/api/release/api/process/activate2', payload1);
      const responseArray = Object.values(responseSend);
      const currentStatus = responseArray && responseArray.filter(myResponse => myResponse.updateInstanceStatusResponse.statusCode === '200');
      if (currentStatus !== null && currentStatus.length > 0) {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: SUCCESS,
            status: `The loan has been successfully sent back to Doc Gen ${isStager ? 'Stager' : ' queue for rework'}`,
          },
        });
        yield put({
          type: SET_ENABLE_SEND_BACK_GEN,
          payload: false,
        });
      } else {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: ERROR,
            status: 'Invalid Event or Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
          },
        });
      }
    } else {
      const message = `Unable to send back to Doc Gen ${isStager ? 'Stager' : ''}. Eval status should be Approved, and the Eval Sub Status should be Referral or Referral KB and the most recent Resolution case (within the eval) Status should ${isStager ? 'be Open' : 'not be Open or Rejected'}`;
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: message,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* sendToDocsIn() {
  const evalId = yield select(selectors.evalId);
  const processStatus = yield select(selectors.processStatus);
  const isModBook = R.equals(processStatus.toLowerCase(), 'suspended');
  try {
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    yield put({ type: SHOW_LOADER });
    const response = yield call(Api.callGet, `/api/cmodnetcoretkams/DocsIn/${isModBook ? 'ModBooking' : 'BuyOutBooking'}?EvalId=${evalId}`);
    if (response !== null && response === true) {
      const payload1 = JSON.parse(`{
        "evalid": "${evalId}",
        "eventname": "sendToDocsIn",
        "userID": "${userPrincipalName}"
      }`);
      const responseSend = yield call(Api.callPost, '/api/release/api/process/activate2', payload1);
      const responseArray = Object.values(responseSend);
      const currentStatus = responseArray && responseArray.filter(myResponse => myResponse.updateInstanceStatusResponse.statusCode === '200');
      if (currentStatus !== null && currentStatus.length > 0) {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: SUCCESS,
            status: 'The loan has been successfully sent back to Docs In',
          },
        });
        yield put({
          type: SET_ENABLE_SEND_BACK_DOCSIN,
          payload: false,
        });
        yield put({
          type: SET_ENABLE_SEND_TO_BOOKING,
          payload: false,
        });
      } else {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: ERROR,
            status: 'Invalid Event or Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
          },
        });
      }
    } else {
      const message = `Unable to send back to Docs In. Eval status should be ${isModBook ? 'Approved or Completed' : 'Approved'} and the most recent Resolution case (within the eval) Status should be ${isModBook ? 'Approved, Sent for Approval, Closed or Booked' : 'Approved or Sent for Approval'}`;
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: message,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* sendToBooking() {
  const evalId = yield select(selectors.evalId);
  try {
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    yield put({ type: SHOW_LOADER });
    const payload1 = JSON.parse(`{
        "evalID": "${evalId}",
        "taskName": "Pending Buyout",
        "taskStatus": "Force Buyout Completed",
        "userID": "${userPrincipalName}"
      }`);
    const responseSend = yield call(Api.callPost, '/api/release/api/process/movePendingBuyout', payload1);
    const responseArray = Object.values(responseSend);
    const currentStatus = responseArray && responseArray.filter(myResponse => myResponse.statusCode === '200');
    if (currentStatus !== null && currentStatus.length > 0) {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: SUCCESS,
          status: 'The loan is moved to booking.  Please manually code the account for booking',
        },
      });
      yield put({
        type: SET_ENABLE_SEND_TO_BOOKING,
        payload: false,
      });
      yield put({
        type: SET_ENABLE_SEND_BACK_DOCSIN,
        payload: false,
      });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: 'Invalid Event or Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* sendToFEUW(action) {
  try {
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const request = {
      ...action.payload,
      userPrincipalName,
    };
    yield put({ type: SHOW_LOADER });
    const response = yield call(Api.callPost, '/api/workassign/sendToFEUW', request);
    const { status, message } = response;
    if (status === '200') {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: SUCCESS,
          status: message,
        },
      });
      yield put({
        type: DISABLE_SEND_TO_FEUW,
      });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: LEVEL_FAILED,
          status: status === '500' ? MSG_SERVICE_DOWN : message,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* onSelectTrialTask(payload) {
  try {
    const response = yield call(Api.callPost, '/api/stager/stager/completeTrialForbearanceTasks?bulk=false', payload.payload);
    if (response !== null) {
      yield put({
        type: SET_TRIAL_RESPONSE,
        payload: {
          level: response.isError ? 'Warning' : 'Success',
          status: response.message,
        },
      });
      yield put({
        type: DISABLE_TRIAL_BUTTON,
        payload: {
          disableTrialTaskButton: !response.isError,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_TRIAL_RESPONSE,
      payload: {
        level: 'Warning',
        status: MSG_SERVICE_DOWN,
      },
    });
  }
}

function* populateInvestorDropdown(payload) {
  try {
    const responseMapper = item => ({
      portfolioCode: item.className,
      requestType: item.classCode,
      activeIndicator: item.activeIndicator,
      displayText: item.displayText,
    });
    const type = R.propOr('', 'payload', payload);

    let response = yield call(Api.callGet, `/api/dataservice/api/classCodes/${type}`);
    if (response && response.length > 0) {
      response = R.map(responseMapper, response);
    }
    if (type === APPROVAL_TYPE) {
      yield put({
        type: SAVE_APPROVAL_DROPDOWN,
        payload: response,
      });
    } else if (type === PRE_APPROVAL_TYPE) {
      yield put({
        type: SAVE_PREAPPROVAL_DROPDOWN,
        payload: response,
      });
    } else {
      yield put({
        type: SAVE_INVESTOR_EVENTS_DROPDOWN,
        payload: response,
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
}

function* populateDropdown() {
  try {
    const userGroupsList = yield select(loginSelectors.getGroupList());
    const isManager = userGroupsList.includes('docgenvendor-mgr');
    const response = yield call(Api.callGet, `/api/dataservice/api/covius/eventCategoriesAndTypes/${isManager}`);
    yield put({
      type: SAVE_EVENTS_DROPDOWN,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
}

function* onFhlmcBulkUpload(payload) {
  const {
    caseIds, requestIdType, loanAndDisasterIds, selectedPreApprovalType,
  } = payload.payload;
  const isWidgetOpen = yield select(widgetSelectors.getCurrentWidget);
  const resolutionData = yield select(tombstoneSelectors.getTombstoneData);
  const resolutionChoiceType = R.prop('content', R.find(R.propEq('title', 'Modification Type'), resolutionData));
  let response;
  let idType;
  try {
    if ((caseIds && caseIds.length > 50)
      || (loanAndDisasterIds && loanAndDisasterIds.length > 50)) {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: `Please upload a maximum of 50 ${requestIdType}`,
        },
      });
      return;
    }
    if (requestIdType === 'Loan Number(s)') {
      const loanNumbers = R.pluck('loanNumber', loanAndDisasterIds);
      const loanSet = new Set(loanNumbers);
      if (loanNumbers.length !== loanSet.size) {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: ERROR,
            status: `There are duplicate ${requestIdType}. Please correct and resubmit`,
          },
        });
        return;
      }
      yield put({ type: SHOW_LOADER });
      idType = 'Loan Number(s)';

      response = yield call(Api.callPost,
        `/api/cmodinvestor/preapproval-data?approvalType=preapproval&approvalSubType=${selectedPreApprovalType.toLowerCase()}`, loanAndDisasterIds);
      // Clearing resultData before getting eventData
      yield put({
        type: SET_BULK_UPLOAD_RESULT,
        payload: {},
      });
    } else {
      const caseSet = new Set(caseIds);
      if (caseIds.length !== caseSet.size) {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: ERROR,
            status: `There are duplicate ${requestIdType}. Please correct and resubmit`,
          },
        });
        return;
      }
      yield put({ type: SHOW_LOADER });
      idType = R.equals('Case id(s)', requestIdType) ? 'caseId' : 'loanNbr';
      response = yield call(Api.callPost,
        `/api/cmodinvestor/loan-data?requestIdType=${idType}`, caseIds);
      // Clearing resultData before getting eventData
      yield put({
        type: SET_BULK_UPLOAD_RESULT,
        payload: {},
      });
      if (!R.isEmpty(isWidgetOpen)) {
        const caseId = R.head(caseIds);
        const eligibiltyresponse = yield call(Api.callGetText, `/api/dataservice/api/fetchCaseEligibilityIndicator?caseId=${caseId}&resolutionChoiceType=${resolutionChoiceType}`);
        yield put({
          type: GET_ELIGIBLE_DATA,
          payload: eligibiltyresponse,
        });
      }
    }
    if (!R.isNil(response)) {
      const hasStatusCode = R.has('status', response);
      if (hasStatusCode && R.equals(R.path(['status'], response), 404)) {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: ERROR,
            status: MSG_SERVICE_DOWN,
          },
        });
      } else {
        if (R.contains(false, R.pluck('isValid', response))) {
          yield put({
            type: SET_USER_NOTIFICATION,
            payload: {
              message: `Entered incorrect ${idType === 'caseId' ? 'Case ID' : 'Loan Number or Disaster Id'}.Highlighted in Red for your reference`,
              level: ERROR,
            },
          });
        }
        yield put({
          type: SET_BULK_UPLOAD_RESULT,
          payload: response,
        });
        yield put({
          type: SET_DISABLE_GENERATE_BOARDING_TEMPLATE,
          payload: false,
        });
      }
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: MSG_SERVICE_DOWN,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* onCoviusBulkUpload(payload) {
  const {
    ids, holdAutomation, eventCode, eventCategory, idType,
  } = payload.payload;
  let response;
  try {
    if (ids.length > 500) {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: `Please upload a maximum of 500 ${idType}`,
        },
      });
      return;
    }
    const caseSet = new Set(ids);
    if (ids.length !== caseSet.size) {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: `There are duplicate ${idType}. Please correct and resubmit`,
        },
      });
      return;
    }
    const user = yield select(loginSelectors.getUser);
    const userEmail = R.path(['userDetails', 'email'], user);
    const requestBody = {
      holdAutomation,
      caseIds: R.indexOf('Case', idType) ? '' : ids,
      requestIds: R.indexOf('Request', idType) ? '' : ids,
      eventCode: eventCode.trim(),
      eventCategory: eventCategory.trim(),
      user: userEmail,
    };
    yield put({ type: SHOW_LOADER });
    response = yield call(Api.callPost, '/api/docfulfillment/api/covius/getEventData', requestBody);
    // Clearing resultData before getting eventData
    yield put({
      type: SET_BULK_UPLOAD_RESULT,
      payload: {},
    });
    if (response !== null && (R.has('invalidCases', response) || R.has('request', response))) {
      yield put({
        type: SET_BULK_UPLOAD_RESULT,
        payload: response,
      });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: 'This loan do not exist or currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* AddDocsInReceived(payload) {
  const { pageType } = payload.payload;
  let response;
  try {
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    yield put({ type: SHOW_LOADER });
    if (pageType === 'BULKUPLOAD_DOCSIN') {
      const { loanNumbers } = payload.payload;
      response = yield call(Api.callPost, `/api/release/api/process/docsInMoveLoan?user=${userPrincipalName}`, loanNumbers);
    } else {
      const payloadData = {
        moveLoan: payload.payload,
        userId: userPrincipalName,
        selectedStatus: payload.payload.status,
      };
      response = yield call(Api.callPost, 'api/stager/dashboard/getBulkOrder', payloadData);
    }
    if (response !== null) {
      yield put({
        type: SET_ADD_BULK_ORDER_RESULT,
        payload: response,
      });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: ERROR,
          status: 'This loan do not exist or currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}

function* onSelectModReversal() {
  try {
    const response = yield call(Api.callGet, '/api/dataservice/api/modreversal/reasons');
    if (response !== null) {
      yield put({
        type: MOD_REVERSAL_DROPDOWN_VALUES,
        payload: response,
      });
    }
  } catch (e) {
    yield put({
      type: MOD_REVERSAL_DROPDOWN_VALUES,
      payload: [],
    });
  }
}

function* onFHLMCModHistoryPopup() {
  try {
    const loanNumber = yield select(selectors.loanNumber);
    const response = yield call(Api.callGet, `/api/dataservice/api/investorRequestResponse/${loanNumber}`);
    if (response !== null) {
      yield put({
        type: SET_FHLMC_MOD_HISTORY,
        payload: response,
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
}

function* manualInsertion(payload) {
  try {
    yield put({ type: SHOW_LOADER });
    const dataPay = {
      evalIds: payload.payload,
    };
    const response = yield call(Api.callPost, '/api/disposition/bulk/insertEval', dataPay);
    const filteredResponse = [];
    response.forEach((evalData) => {
      if (!evalData) {
        filteredResponse.push();
      } else {
        const evalResponse = evalData.statusCode && evalData.statusCode === 204
          ? DashboardModel.InvalidEvalResponse(evalData.evalId) : null;
        filteredResponse.push(evalResponse || evalData);
      }
    });
    yield put({
      type: STORE_EVALID_RESPONSE,
      payload: filteredResponse,
    });
  } catch (e) {
    yield put({
      type: STORE_EVALID_RESPONSE_ERROR,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}


const onUploadingFile = function* onUploadingFile(action) {
  const file = action.payload;
  try {
    if (file) {
      const data = yield call(processExcel, file);
      if (data) {
        yield put({
          type: SAVE_PROCESSED_FILE,
          payload: data,
        });
      }
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          status: 'Excel file uploaded successfully',
          level: 'Success',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: MSG_FILE_UPLOAD_FAILURE,
        level: 'Failed',
      },
    });
  }
};

function* sendNotification(userNotification, resultSet, sweetAlert) {
  if (!R.isNil(userNotification)) {
    yield put({
      type: SET_USER_NOTIFICATION,
      payload: userNotification,
    });
  } else {
    yield put({
      type: DISMISS_USER_NOTIFICATION,
    });
  }
  if (!R.isNil(resultSet)) {
    yield put({
      type: SET_FHLMC_UPLOAD_RESULT,
      payload: resultSet,
    });
  }
  if (!R.isNil(sweetAlert)) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: sweetAlert,
    });
  }
}

const submitToFhlmc = function* submitToFhlmc(action) {
  const file = yield select(selectors.getUploadedFile);
  const user = yield select(loginSelectors.getUser);
  const resultData = yield select(selectors.resultData);
  const cancellationReason = yield select(selectors.getSelectedCancellationReason);
  const userName = R.path(['userDetails', 'email'], user);
  const winLoginName = user.userDetails.onPremisesSamAccountName;
  const { selectedRequestType, portfolioCode } = action.payload;
  const isWidgetOpen = yield select(widgetSelectors.getCurrentWidget);
  const resolutionData = yield select(tombstoneSelectors.getTombstoneData);
  const resolutionChoiceType = R.prop('content', R.find(R.propEq('title', 'Modification Type'), resolutionData));
  const caseId = R.head(R.pluck('resolutionId', resultData));
  let resultSet = null;
  let userNotification = null;
  let sweetAlert = null;
  try {
    const response = yield call(Api.callPost, `/api/cmodinvestor/validation?requestType=${selectedRequestType}&portfolioCode=${portfolioCode}&userName=${userName}&winLoginName=${winLoginName}&cancellationReason=${cancellationReason}`, JSON.parse(file));
    // Clearing resultData before getting eventData
    yield put({
      type: SET_FHLMC_UPLOAD_RESULT,
      payload: {},
    });
    yield put({
      type: SET_USER_NOTIFICATION,
      payload: {},
    });
    const hasStatusCode = R.has('statusCode', response);
    const parsedData = JSON.parse(file);
    if (!hasStatusCode) {
      const data = R.map((cases) => {
        const filteredData = R.filter(datae => R.equals(datae.loanIdentifier.toString(),
          cases.loanIdentifier), parsedData);
        const caseData = {};
        caseData.loanNumber = R.head(filteredData).servicerLoanIdentifier;
        caseData.evalId = R.head(filteredData).evalId;
        caseData.resolutionId = R.head(filteredData).resolutionId;
        caseData.isValid = cases.isValid;
        caseData.status = cases.status;
        caseData.RequestType = cases.workoutReportingStatusType;
        caseData.message = JSON.stringify(cases);
        return caseData;
      }, response);
      resultSet = data;
      let message = 'Your request has been successfully sent to Freddie, please download the excel to view more details.';
      let level = 'Success';
      if (!R.isEmpty(isWidgetOpen)) {
        switch (data[0].status) {
          case 'ODM FAILED': {
            level = FAILED;
            message = 'An error occured in ODM. Please download the excel to view more details. If the issue continues to persist please reach to IT team';
            break;
          } case 'TKAMS FAILED': {
            level = FAILED;
            message = 'An error occured in saving to TKAMS. Please download the excel to view more details. If the issue continues to persist please reach to IT team';
            break;
          }
          case 'FREDDIE FAILED': {
            level = FAILED;
            message = 'An error occured in sending to Freddie. Please download the excel to view more details. If the issue continues to persist please reach to IT team';
            break;
          }
          case 'FREDDIE INELIGIBLE': {
            level = FAILED;
            message = 'The loan is not eligible for modification as per Freddie. Please download the excel to view more details.';
            break;
          }
          case 'ODM INELIGIBLE': {
            level = FAILED;
            message = 'The loan is not eligible for modification as per ODM rules. Please download the excel to view more details.';
            break;
          }
          default: {
            level = 'Success';
            message = 'Your request has been successfully sent to Freddie, please download the excel to view more details.';
            break;
          }
        }
        const eligibiltyresponse = yield call(Api.callGetText, `/api/dataservice/api/fetchCaseEligibilityIndicator?caseId=${caseId}&resolutionChoiceType=${resolutionChoiceType}`);
        yield put({
          type: GET_ELIGIBLE_DATA,
          payload: eligibiltyresponse,
        });
      } sweetAlert = {
        level,
        status: message,
      };
    } else if (response.statusCode === 422) {
      const { invalidLoans } = response;
      const caseIds = Object.keys(invalidLoans);
      const data = R.map((cases) => {
        const caseData = {};
        caseData.resolutionId = cases.resolutionId;
        caseData.loanNumber = cases.servicerLoanIdentifier;
        caseData.isValid = !R.contains(cases.resolutionId.toString(), caseIds);
        return caseData;
      }, parsedData);
      userNotification = {
        message: "Entered incorrect 'LoanId/CaseId'.Highlighted in Red for your reference",
        level: ERROR,
      };
      resultSet = data;
      sweetAlert = {
        status: 'Incorrect Data present in the excel. Please update and try again',
        level: FAILED,
      };
    } else if (response.statusCode === 400) {
      resultSet = resultData;
      const nonValidResponseObjects = R.pluck('isValid', resultData);
      if ((!R.isEmpty(nonValidResponseObjects) && nonValidResponseObjects.includes(false))) {
        userNotification = {
          message: "Entered incorrect 'LoanId/CaseId'.Highlighted in Red for your reference",
          level: ERROR,
        };
      }
      sweetAlert = {
        level: FAILED,
        status: MSG_SERVICE_DOWN,
      };
    }
    yield call(sendNotification, userNotification, resultSet, sweetAlert);
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: MSG_SERVICE_DOWN,
        level: LEVEL_FAILED,
      },
    });
  }
};

const submitToBoardingTemplate = function* submitToBoardingTemplate(action) {
  const user = yield select(loginSelectors.getUser);
  const userName = R.path(['userDetails', 'email'], user);
  const winLoginName = user.userDetails.onPremisesSamAccountName;
  const { selectedRequestType, portfolioCode } = action.payload;
  const responseData = yield select(selectors.resultData);
  const validData = R.filter(R.propEq('isValid', true), responseData);
  try {
    const response = yield call(Api.callPost, `/api/cmodinvestor/boarding-template?requestType=${selectedRequestType}&portfolioCode=${portfolioCode}&userName=${userName}&winLoginName=${winLoginName}`, validData);
    if (response) {
      yield put({
        type: SET_DISABLE_GENERATE_BOARDING_TEMPLATE,
        payload: true,
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
  yield put({ type: HIDE_LOADER });
};

const sendToCovius = function* sendToCovius(eventCode, payload) {
  const user = yield select(loginSelectors.getUser);
  const userPrincipalName = R.path(['userDetails', 'email'], user);
  const body = {
    user: userPrincipalName,
    request: payload,
  };
  const requestEndpoint = eventCode ? '/covius/statusChangeRequest' : '/covius/manualDocumentFulfillmentRequest';
  const response = yield call(Api.callPost, `/api/docfulfillment/api${requestEndpoint}`, body);
  let level = '';
  level = R.equals(response.status, 200) ? SUCCESS : LEVEL_FAILED;
  const result = {
    uploadFailed: response.invalidCases,
    message: response && R.equals(response.status, 200)
      ? response.message : MSG_SENDTOCOVIUS_FAILED,
    level,
    eventCode,
    clearData: R.equals(response.status, 200),
  };
  yield put({
    type: SET_COVIUS_TABINDEX,
    payload: { coviusTabIndex: R.equals(level, LEVEL_FAILED) ? 3 : 0 },
  });
  return result;
};

const onFileSubmit = function* onFileSubmit() {
  try {
    const file = yield select(selectors.getUploadedFile);
    const eventCode = file && R.has('EventCode', R.head(JSON.parse(file)));
    const response = yield call(sendToCovius, eventCode, JSON.parse(file));
    yield put({
      type: SET_COVIUS_DATA,
      payload: response,
    });
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: response.message,
        level: response.level,
        clearData: response.clearData,
      },
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: MSG_SERVICE_DOWN,
        level: LEVEL_FAILED,
      },
    });
  }
};

const submitToCovius = function* submitToCovius(action) {
  const eventCategory = action.payload;
  const isStatusChangeRequest = eventCategory !== DashboardModel.EVENT_CATEGORY_FILTER;
  const { request } = yield select(selectors.resultData);
  try {
    const response = yield call(sendToCovius, isStatusChangeRequest, request);
    yield put({
      type: SET_COVIUS_DATA,
      payload: response,
    });
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: response.message,
        level: response.level,
        clearData: response.clearData,
      },
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: MSG_SERVICE_DOWN,
        level: LEVEL_FAILED,
      },
    });
  }
};

const onDownloadFile = function* onDownloadFile(action) {
  const fileData = action.payload;
  try {
    const ws = XLSX.utils.json_to_sheet(fileData.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileData.fileName);
    XLSX.writeFile(wb, fileData.fileName);
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: 'Excel File Downloaded Successfully',
        level: 'Success',
      },
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: MSG_FILE_DOWNLOAD_FAILURE,
        level: LEVEL_FAILED,
      },
    });
  }
};

const onSubmitEval = function* onSubmitEval(action) {
  const evalId = R.pathOr([], ['evalId'], action.payload);
  const taskName = R.pathOr('', ['taskName'], action.payload);
  const user = yield select(loginSelectors.getUser);
  const userEmail = R.path(['userDetails', 'email'], user);
  const body = {
    evalId,
    taskName,
    userEmail,
  };
  const response = yield call(Api.callPost, '/api/release/api/process/validateEligibleTask', body);
  if (response.length > 0 && response != null) {
    yield put({
      type: SET_VALID_EVALDATA,
      payload: response,
    });
  } else {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: MSG_SENDTOEVAL_FAILED,
        level: LEVEL_FAILED,
      },
    });
  }
};

const fetchCancellationReasons = function* fetchCancellationReasons() {
  try {
    const responseMapper = item => ({
      tooltip: item.longDescription,
      requestType: item.classCode,
      displayText: item.displayText,
    });
    let response = yield call(Api.callGet, '/api/dataservice/api/classCodes/FHLMCCancelReason');
    if (response && response.length > 0) {
      response = R.map(responseMapper, response);
    }
    yield put({
      type: SET_CANCELLATION_REASON,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: ERROR,
        status: MSG_SERVICE_DOWN,
      },
    });
  }
};

function* watchSubmitToFhlmc() {
  yield takeEvery(SUBMIT_TO_FHLMC, submitToFhlmc);
}

function* watchSubmitToCovius() {
  yield takeEvery(SEND_TO_COVIUS, submitToCovius);
}

function* watchPopulateEventsDropDown() {
  yield takeEvery(POPULATE_EVENTS_DROPDOWN, populateDropdown);
}

function* watchInvestorPopulateEventsDropDown() {
  yield takeEvery(POPULATE_INVESTOR_EVENTS_DROPDOWN, populateInvestorDropdown);
}

function* watchCoviusBulkOrder() {
  yield takeEvery(PROCESS_COVIUS_BULK, onCoviusBulkUpload);
}
function* watchFhlmcBulkOrder() {
  yield takeEvery(PROCESS_FHLMC_RESOSLVE_BULK, onFhlmcBulkUpload);
}
function* watchFhlmcModHistory() {
  yield takeEvery(GET_FHLMC_MOD_HISTORY, onFHLMCModHistoryPopup);
}
function* watchManualInsertion() {
  yield takeEvery(INSERT_EVALID, manualInsertion);
}
function* watchAssignLoan() {
  yield takeEvery(ASSIGN_LOAN, assignLoan);
}

function* watchLoadTrials() {
  yield takeEvery(LOAD_TRIALS_SAGA, loadTrials);
}

function* watchSentToUnderwriting() {
  yield takeEvery(SET_TASK_UNDERWRITING, sentToUnderwriting);
}

function* watchSendToDocGen() {
  yield takeEvery(SET_TASK_SENDTO_DOCGEN, sendToDocGen);
}

function* watchSendToDocsIn() {
  yield takeEvery(SET_TASK_SENDTO_DOCSIN, sendToDocsIn);
}

function* watchSendToBooking() {
  yield takeEvery(SET_TASK_SENDTO_BOOKING, sendToBooking);
}

function* watchSendToFEUW() {
  yield takeEvery(SEND_TO_FEUW_SAGA, sendToFEUW);
}

function* watchAddDocsInReceived() {
  yield takeEvery(SET_ADD_DOCS_IN, AddDocsInReceived);
}

function* watchOnSelectReject() {
  yield takeEvery(SELECT_REJECT_SAGA, onSelectReject);
}

function* watchOnSearchWithTask() {
  yield takeEvery(SEARCH_LOAN_WITH_TASK_SAGA, onSearchWithTask);
}

function* watchOnSelectModReversal() {
  yield takeEvery(MOD_REVERSAL_REASONS, onSelectModReversal);
}

function* watchOnTrialTask() {
  yield takeEvery(TRIAL_TASK, onSelectTrialTask);
}

function* watchOnUploadFile() {
  yield takeEvery(PROCESS_FILE, onUploadingFile);
}

function* watchOnSubmitFile() {
  yield takeEvery(SUBMIT_FILE, onFileSubmit);
}

function* watchOnDownloadFile() {
  yield takeEvery(DOWNLOAD_FILE, onDownloadFile);
}

function* watchonSubmitEval() {
  yield takeEvery(SET_EVALID, onSubmitEval);
}
function* watchOnWidgetClick() {
  yield takeEvery(ASSIGN_BOOKING_LOAN, assignBookingLoan);
}

function* watchUnassignBookingLoan() {
  yield takeEvery(UNASSIGN_BOOKING_LOAN, unassignBookingLoan);
}

function* watchAdditionalInfo() {
  yield takeEvery(FETCH_EVAL_CASE, fetchEvalCaseDetails);
}

function* watchEvalRowSelect() {
  yield takeEvery(EVAL_ROW_CLICK, fetchCaseDetails);
}

function* watchCheckTrialEnable() {
  yield takeEvery(CHECK_TRIAL_DISABLE_STAGER_BUTTON, checkTrialEnable);
}

function* watchSubmitToBoardingTemplate() {
  yield takeEvery(SUBMIT_TO_BOARDING_TEMPLATE, submitToBoardingTemplate);
}

function* watchCancellationReasons() {
  yield takeEvery(GET_CANCELLATION_REASON, fetchCancellationReasons);
}


export const TestExports = {
  autoSaveOnClose,
  checklistSelectors,
  resetChecklistData,
  unassignBookingLoan,
  getResolutionDataForEval,
  fetchChecklistDetailsForAssign,
  endShift,
  errorFetchingChecklistDetails,
  fetchChecklistDetails,
  fetchChecklistDetailsForGetNext,
  saveDisposition,
  setExpandView,
  processExcel,
  saveGeneralChecklistDisposition,
  searchLoan,
  selectEval,
  unassignLoan,
  assignLoan,
  populateDropdown,
  onCoviusBulkUpload,
  watchAutoSave,
  watchEndShift,
  watchSetExpandView,
  watchGetNext,
  getNext,
  onUploadingFile,
  onFileSubmit,
  onDownloadFile,
  sendToCovius,
  sendToFEUW,
  watchDispositionSave,
  watchSearchLoan,
  watchTombstoneLoan,
  watchUnassignLoan,
  watchAssignLoan,
  watchValidateDispositon,
  watchSentToUnderwriting,
  watchLoadTrials,
  watchSendToDocGen,
  watchSendToDocsIn,
  watchSendToBooking,
  watchSendToFEUW,
  watchContinueMyReview,
  watchCompleteMyReview,
  watchAddDocsInReceived,
  watchOnSelectReject,
  watchOnSearchWithTask,
  watchOnTrialTask,
  watchCoviusBulkOrder,
  watchOnUploadFile,
  watchOnSubmitFile,
  watchPopulateEventsDropDown,
  watchOnDownloadFile,
  assignBookingLoan,
  watchLoanviewTombstoneData,
  watchonSubmitEval,
  onSubmitEval,
};

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchSubmitToFhlmc(),
    watchInvestorPopulateEventsDropDown(),
    watchSubmitToCovius(),
    watchAutoSave(),
    watchDispositionSave(),
    watchFhlmcBulkOrder(),
    watchGetNext(),
    watchSetExpandView(),
    watchUnassignBookingLoan(),
    watchEndShift(),
    watchSearchLoan(),
    watchTombstoneLoan(),
    watchUnassignLoan(),
    watchAssignLoan(),
    watchValidateDispositon(),
    watchLoadTrials(),
    watchSentToUnderwriting(),
    watchSendToDocGen(),
    watchSendToDocsIn(),
    watchSendToBooking(),
    watchSendToFEUW(),
    watchContinueMyReview(),
    watchAddDocsInReceived(),
    watchOnSelectReject(),
    watchOnSearchWithTask(),
    watchOnSelectModReversal(),
    watchFhlmcModHistory(),
    watchManualInsertion(),
    watchCompleteMyReview(),
    watchOnTrialTask(),
    watchCoviusBulkOrder(),
    watchOnUploadFile(),
    watchOnSubmitFile(),
    watchOnDownloadFile(),
    watchPopulateEventsDropDown(),
    watchOnWidgetClick(),
    watchAdditionalInfo(),
    watchEvalRowSelect(),
    watchLoanviewTombstoneData(),
    watchonSubmitEval(),
    watchCheckTrialEnable(),
    watchSubmitToBoardingTemplate(),
    watchCancellationReasons(),
  ]);
};

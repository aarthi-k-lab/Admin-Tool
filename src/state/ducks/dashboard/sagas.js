import {
  select,
  take,
  takeEvery,
  // takeLast,
  all,
  call,
  fork,
  put,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import { actions as tombstoneActions } from 'ducks/tombstone/index';
import { actions as commentsActions } from 'ducks/comments/index';
import { selectors as loginSelectors } from 'ducks/login/index';
import {
  actions as checklistActions,
  selectors as checklistSelectors,
} from 'ducks/tasks-and-checklist/index';
import * as XLSX from 'xlsx';
import AppGroupName from 'models/AppGroupName';
import EndShift from 'models/EndShift';
import ChecklistErrorMessageCodes from 'models/ChecklistErrorMessageCodes';
import processExcel from '../../../lib/excelParser';
import { POST_COMMENT_SAGA } from '../comments/types';
import selectors from './selectors';
// import { mockData } from '../../../containers/LoanActivity/LoanActivity';
import {
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
  SET_RESULT_OPERATION,
  CONTINUE_MY_REVIEW,
  CONTINUE_MY_REVIEW_RESULT,
  COMPLETE_MY_REVIEW_RESULT,
  SET_ENABLE_SEND_BACK_GEN,
  SET_COVIUS_BULK_UPLOAD_RESULT,
  PROCESS_COVIUS_BULK,
  SET_ADD_DOCS_IN,
  SET_ADD_BULK_ORDER_RESULT,
  SET_ENABLE_SEND_BACK_DOCSIN,
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
  GET_SUBMIT_RESPONSE,
  GET_COVIUS_DATA,
  DOWNLOAD_FILE,
  SET_DOWNLOAD_RESPONSE,
  POPULATE_EVENTS_DROPDOWN,
  SAVE_EVENTS_DROPDOWN,
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
} from '../tasks-and-checklist/types';

const {
  Messages:
  {
    LEVEL_ERROR, LEVEL_SUCCESS,
    MSG_VALIDATION_SUCCESS,
    MSG_UPDATED_REMEDY,
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

const searchLoan = function* searchLoan(loanNumber) {
  const searchLoanNumber = R.propOr({}, 'payload', loanNumber);
  const wasSearched = yield select(selectors.wasSearched);
  const inProgress = yield select(selectors.inProgress);

  if (!wasSearched && !inProgress) {
    yield put({ type: SHOW_LOADER });
  }
  if (!wasSearched) {
    try {
      const response = yield call(Api.callGet, `/api/search-svc/search/loan/${searchLoanNumber}`, {});
      if (response !== null) {
        yield put({
          type: SEARCH_LOAN_RESULT,
          payload: response,
        });
      } else {
        yield put({
          type: SEARCH_LOAN_RESULT,
          payload: { statusCode: 404 },
        });
      }
    } catch (e) {
      yield put({
        type: SEARCH_LOAN_RESULT,
        payload: { loanNumber: searchLoanNumber, valid: false },
      });
    }
  }
};

function* onSelectReject(payload) {
  const {
    evalId, userID, eventName, loanNumber,
  } = payload.payload;
  const response = yield call(Api.callPost, `/api/workassign/unreject?evalId=${evalId}&userID=${userID}&eventName=${eventName}`, {});
  let rejectResponse = {};
  if (response === null) {
    rejectResponse = {
      message: 'Service Down. Please try again...',
      level: 'error',
    };
    yield put({
      type: SELECT_REJECT,
      payload: rejectResponse,
    });
  } else if (response.isActionSuccess) {
    rejectResponse = {
      message: response.message,
      level: 'success',
    };
    yield put({
      type: SELECT_REJECT,
      payload: rejectResponse,
    });
  } else {
    rejectResponse = {
      message: response.message,
      level: 'error',
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

// function* fetchLoanActivityDetails(evalDetails) {
//   const { payload } = evalDetails;
//   const groupList = yield select(loginSelectors.getGroupList);
//   const hasLoanActivityAccess = RouteAccess.hasLoanActivityAccess(groupList);
//   if (hasLoanActivityAccess) {
//     // Here we need to get data from actual api
//     const response = mockData(R.equals(payload.taskName,
//  'Trial Modification') ? 'Trial' : payload.taskName);
//     yield put({ type: GET_LOAN_ACTIVITY_DETAILS, payload: response });
//   }
// }
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

function* selectEval(searchItem) {
  const evalDetails = R.propOr({}, 'payload', searchItem);
  let taskCheckListId = R.pathOr('', ['payload', 'taskCheckListId'], searchItem);
  yield put(resetChecklistData());
  const user = yield select(loginSelectors.getUser);
  const { userDetails } = user;
  const appGroupName = yield select(selectors.groupName);
  evalDetails.assignee = evalDetails.assignee === 'In Queue' ? null : evalDetails.assignee;
  evalDetails.isAssigned = false;
  let assignedTo = userDetails.email ? userDetails.email.toLowerCase().split('@')[0].split('.').join(' ') : null;
  if (appGroupName === DashboardModel.BOOKING && evalDetails.piid != null) {
    const tasksForProcess = yield call(Api.callGet, `/api/bpm-audit/audit/task/process/${evalDetails.piid}`);
    const latestPendingBookingTask = R.head(R.filter(
      task => task.taskName === DashboardModel.PENDING_BOOKING, tasksForProcess,
    ));
    const { taskId } = latestPendingBookingTask;
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
  yield call(fetchChecklistDetailsForSearchResult, taskCheckListId);
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
function* watchTombstoneLoan() {
  yield takeEvery(SEARCH_SELECT_EVAL, selectEval);
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
      payload: { error: R.has('error', response) },
    });
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
          type: LEVEL_ERROR,
          data: tkamsValidation.discrepancies,
        },
      });
    } else {
      let message = isAuto ? MSG_UPDATED_REMEDY : MSG_VALIDATION_SUCCESS;
      let type = LEVEL_SUCCESS;
      if (validateAgent) {
        type = skillValidation.result ? LEVEL_SUCCESS : LEVEL_ERROR;
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
  return {
    loanNumber,
    evalId,
    taskId,
    taskIterationCounter,
    piid,
    brand,
  };
}

function getCommentPayload(taskDetails) {
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
            type: LEVEL_SUCCESS,
            msg: 'Saved Data Successfully',
          },
        });
      }
    }
  } catch (e) {
    yield put({
      type: USER_NOTIF_MSG,
      payload: {
        type: LEVEL_ERROR,
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
          type: LEVEL_SUCCESS,
          msg: 'Dispositioned Successfully',
        },
      });
    }
  } catch (e) {
    yield put({
      type: USER_NOTIF_MSG,
      payload: {
        type: LEVEL_ERROR,
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
    };
    const saveResponse = yield call(Api.callPost, '/api/disposition/checklistDisposition', request);
    const { tkamsValidation, skillValidation } = saveResponse;
    yield put({
      type: SET_GET_NEXT_STATUS,
      payload: tkamsValidation.enableGetNext && (!validateAgent || skillValidation.result),
    });
    if (!tkamsValidation.enableGetNext) {
      yield put({ type: HIDE_LOADER });
      yield put({
        type: USER_NOTIF_MSG,
        payload: {
          type: LEVEL_ERROR,
          data: tkamsValidation.discrepancies,
        },
      });
      return false;
    }
    let message = MSG_VALIDATION_SUCCESS;
    let type = LEVEL_SUCCESS;
    if (validateAgent) {
      type = skillValidation.result ? LEVEL_SUCCESS : LEVEL_ERROR;
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

function getGroup(group) {
  return group === DashboardModel.ALL_STAGER ? DashboardModel.POSTMODSTAGER : group;
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

// eslint-disable-next-line
function* getNext(action) {
  try {
    yield put({ type: SHOW_LOADER });
    yield put({ type: GETNEXT_PROCESSED, payload: false });
    const groupName = yield select(selectors.groupName);
    const group = getGroup(groupName);
    const saveChecklistDisposition = group === DashboardModel.POSTMODSTAGER
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
      if (group === DashboardModel.POSTMODSTAGER) {
        const stagerTaskName = yield select(selectors.stagerTaskName);
        const taskName = action.payload.activeTile || stagerTaskName.activeTile;
        postmodtaskName = taskName === 'Recordation' ? `${taskName}-${(action.payload.activeTab || stagerTaskName.activeTab).replace(/ /g, '')}` : taskName;
      }
      const taskDetails = yield call(Api.callGet, `api/workassign/getNext?appGroupName=${group}&userPrincipalName=${userPrincipalName}&userGroups=${groupList}&taskName=${postmodtaskName}`);
      const taskId = R.pathOr(null, ['taskData', 'data', 'id'], taskDetails);
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
        const commentsPayLoad = getCommentPayload(taskDetails);
        const { taskName } = taskDetails.taskData.data;
        if (R.equals(group, 'BOOKING')) {
          yield call(getResolutionDataForEval, getEvalId(taskDetails));
        }
        yield call(fetchChecklistDetailsForGetNext, taskDetails, action.payload);
        yield put({ type: SAVE_EVALID_LOANNUMBER, payload: evalPayload });
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
    const saveChecklistDisposition = group === DashboardModel.POSTMODSTAGER
      ? savePostModChklistDisposition : saveGeneralChecklistDisposition;
    if (yield call(saveChecklistDisposition, payload)) {
      const dispositionComment = yield select(checklistSelectors.getDispositionComment);
      if (dispositionComment) {
        yield put({ type: POST_COMMENT_SAGA, payload: dispositionComment });
      }
      yield put(resetChecklistData());
      if (group === DashboardModel.POSTMODSTAGER) {
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
    if (group === DashboardModel.POSTMODSTAGER) {
      const stagerTaskName = yield select(selectors.stagerTaskName);
      taskName = stagerTaskName.activeTile === 'Recordation' ? `${stagerTaskName.activeTile}-${stagerTaskName.activeTab.replace(/ /g, '')}` : stagerTaskName.activeTile;
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

function* watchUnassignLoan() {
  yield takeEvery(UNASSIGN_LOAN, unassignLoan);
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
    if (group === DashboardModel.POSTMODSTAGER) {
      const stagerTaskName = yield select(selectors.stagerTaskName);
      taskName = stagerTaskName.activeTile === 'Recordation' ? `${stagerTaskName.activeTile}-${stagerTaskName.activeTab.replace(/ /g, '')}` : stagerTaskName.activeTile;
    } else {
      taskName = groupName === DashboardModel.BOOKING ? DashboardModel.PENDING_BOOKING : '';
    }
    const response = yield call(Api.callPost, `/api/workassign/assignLoan?evalId=${evalId}&assignedTo=${userPrincipalName}&loanNumber=${loanNumber}&taskId=${taskId}&processId=${processId}&processStatus=${processStatus}&groupName=${groupName}&userGroups=${userGroups}&taskName=${taskName}`, {});
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
        payload: { status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.' },
      });
    }
  } catch (e) {
    yield put({ type: ASSIGN_LOAN_RESULT, payload: { status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.' } });
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
        level: LEVEL_ERROR,
        status: message,
      },
    });
  } else {
    yield put({
      type: SET_TASK_UNDERWRITING_RESULT,
      payload: {
        level: LEVEL_ERROR,
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
              level: LEVEL_SUCCESS,
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
              level: LEVEL_ERROR,
              status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
            },
          });
        }
      } else {
        const message = 'Unable to send back to Underwriting because either eval is not '
          + 'in Active status or Resolution is not in Open status.';
        yield put({
          type: SET_TASK_UNDERWRITING_RESULT,
          payload: {
            level: LEVEL_ERROR,
            status: message,
          },
        });
      }
    } else {
      const message = 'Unable to send back to Underwriting because Trial task is not active.';
      yield put({
        type: SET_TASK_UNDERWRITING_RESULT,
        payload: { level: LEVEL_ERROR, status: message },
      });
    }
  } catch (e) {
    yield put({
      type: SET_TASK_UNDERWRITING_RESULT,
      payload: {
        level: LEVEL_ERROR,
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
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
            level: LEVEL_SUCCESS,
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
            level: LEVEL_ERROR,
            status: 'Invalid Event or Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
          },
        });
      }
    } else {
      const message = `Unable to send back to Doc Gen ${isStager ? 'Stager' : ''}. Eval status should be Approved, and the Eval Sub Status should be Referral or Referral KB and the most recent Resolution case (within the eval) Status should ${isStager ? 'be Open' : 'not be Open or Rejected'}`;
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: LEVEL_ERROR,
          status: message,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: LEVEL_ERROR,
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
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
            level: LEVEL_SUCCESS,
            status: 'The loan has been successfully sent back to Docs In',
          },
        });
        yield put({
          type: SET_ENABLE_SEND_BACK_DOCSIN,
          payload: false,
        });
      } else {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: LEVEL_ERROR,
            status: 'Invalid Event or Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
          },
        });
      }
    } else {
      const message = `Unable to send back to Docs In. Eval status should be ${isModBook ? 'Approved or Completed' : 'Approved'} and the most recent Resolution case (within the eval) Status should be ${isModBook ? 'Approved, Sent for Approval, Closed or Booked' : 'Approved or Sent for Approval'}`;
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: LEVEL_ERROR,
          status: message,
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: LEVEL_ERROR,
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
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
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
      },
    });
  }
}

function* populateDropdown() {
  try {
    const response = yield call(Api.callGet, '/api/dataservice/api/covius/eventCategoriesAndTypes/Incoming');
    yield put({
      type: SAVE_EVENTS_DROPDOWN,
      payload: response,
    });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: LEVEL_ERROR,
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
      },
    });
  }
}

function* onCoviusBulkUpload(payload) {
  const {
    caseIds, holdAutomation, eventCode, eventCategory,
  } = payload.payload;
  let response;
  try {
    const caseSet = new Set(caseIds);
    if (caseIds.length !== caseSet.size) {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: LEVEL_ERROR,
          status: 'Please remove duplicate case id(s) and submit again.',
        },
      });
      return;
    }
    const user = yield select(loginSelectors.getUser);
    const userEmail = R.path(['userDetails', 'email'], user);
    const requestBody = {
      holdAutomation,
      caseIds,
      eventCode: eventCode.trim(),
      eventCategory: eventCategory.trim(),
      user: userEmail,
    };
    yield put({ type: SHOW_LOADER });
    console.log(requestBody);
    // response = yield call(Api.callPost,
    //   '/api/docfulfillment/api/covius/getEventData', requestBody);
    response = {
      DocumentRequests: [
        {
          RequestId: '50063C7C-AC12-4035-9F96-9F4FCADEEC1E',
          DocumentType: 'String',
          ReferenceNumber: 'String',
          Name1: 'TestName1',
          Name2: 'TestName2',
          Name3: 'TestName3',
          Name4: 'String',
          Address1: 'TestAddress1',
          Address2: 'TestAddress2',
          Address3: 'TestAddress3',
          City: 'TestCity',
          State: 'State',
          Zip: 'String',
          UserFields: {
            ACCRUED_LTE_CHRGE_AMT: '0',
            ACTIVITIES: {
              ACTIVITY: {
                ACTIVITY_AMT: '0',
                ACTIVITY_DATE: '2001-12-17T09:30:47Z',
                ACTIVITY_DESC: 'String',
                ACTIVITY_TYPE: 'String',
                MOD_IR_CHANGE_DATE: '2001-12-17T09:30:47Z',
                MOD_PI_PMT: 'decimal',
                MOD_PITI_PMT: 'decimal',
                MOD_PMT_DATE_FROM: '2001-12-17T09:30:47Z',
                MOD_PMT_NO_MONTHS: 'string',
                MOD_PMT_RATE: 'int',
                MOD_PMT_YRS: 'string',
                MOD_ESCROW_PMT_01: 'decimal',
                FRB_PMT_DT: '2001-12-17T09:30:47Z',
              },
            },
            ADVANCE_AMT: '0',
            ARM_RESET_FREQUENCY: '0',
            BK_CASE_NUMBER: 'String',
            BK_STATUS: 'String',
            BK_STAY_RELEASE_DATE: '2001-12-17T09:30:47Z',
            BK_WORKSTATION: 'String',
            CONTACTS: {
              CONTACT: {
                CONTACT_TYPE: 'String',
                FIRST_NAME: 'String',
                MIDDLE_NAME: 'String',
                LAST_NAME: 'String',
                SUFFIX: 'String',
                PHONES: {
                  PHONE: [
                    {
                      NUMBER: '3035559824',
                      TYPE: 'LANDLINE',
                      CONSENT: 'Y',
                    },
                    {
                      NUMBER: '7205559824',
                      TYPE: 'WORK',
                      CONSENT: 'N',
                    },
                    {
                      NUMBER: '9515559824',
                      TYPE: 'MOBILE',
                      CONSENT: 'Y',
                    },
                  ],
                },
                ADDRESS1: 'String',
                ADDRESS2: 'String',
                ADDRESS3: 'String',
                PRIMARY_PHONE: '0000000000',
                CITY: 'String',
                STATE: 'String',
                ZIP: 'String',
                SSN_NUMBER: 'string',
                POA: 'string',
                EMAIL_ADDRESS: 'String',
                EMAIL_CONSENT: 'boolean',
                LANDLINE: 'String',
                LANDLINE_CONSENT: 'Boolean',
                FOREIGN_ADDRES1: 'String',
                FOREIGN_ADDRES2: 'String',
                FOREIGN_ADDRES3: 'String',
                FOREIGN_ADDRES4: 'String',
                FOREIGN_PHONE: 'String',
                ALTMAIL_ADDR: 'String',
                ALTMAIL_ADDR2: 'String',
                ALTMAIL_CITY: 'String',
                ALTMAIL_STATE: 'String',
                ALTMAIL_ZIP: 'String',
              },
            },
            BROKER: 'String',
            BROKER_LICENSE: 'String',
            CDE_FC_REASON: 'String',
            CDE_LOAN_DETAIL: '0',
            CDE_PROPERTY_TYPE: '0',
            CLIENTID: 'String',
            CO_OFFICE_ADDR1: 'String',
            CO_OFFICE_ADDR2: 'String',
            CO_OFFICE_CITY: 'String',
            CO_OFFICE_PHONE: 'String',
            CO_OFFICE_STATE: 'String',
            CO_OFFICE_ZIP: 'String',
            COMPANY_ADDRESS: 'String',
            COMPANY_CITY: 'String',
            COMPANY_DBAS: 'String',
            COMPANY_EMAIL: 'String',
            COMPANY_FAX: 'String',
            COMPANY_HOURS: 'String',
            COMPANY_LOGO_FILENAME: 'String',
            COMPANY_NAME: 'String',
            COMPANY_PHONE: 'String',
            COMPANY_SHORT_NAME: 'String',
            COMPANY_STATE: 'String',
            COMPANY_WEB: 'String',
            COMPANY_ZIP: 'String',
            CORRESPONDENCE_ADDRESS: 'String',
            CORRESPONDENCE_CITY: 'String',
            CORRESPONDENCE_STATE: 'String',
            CORRESPONDENCE_ZIP: 'String',
            DEFAULT_DATE: '2001-12-17T09:30:47Z',
            DELQ_DAYS: '0',
            DELQ_ESCROW_AMT: '0',
            DELQ_INTEREST_AMT: '0',
            DELQ_MONTHS_DUE: '0',
            DELQ_PRINCIPAL_AMT: '0',
            DELQ_PYMNT_AMT: '0',
            DE_REINSTATE_PHONE_NUMBER: 'String',
            ENTITIES: {
              ENTITY: {
                ENTITY_TYPE: 'String',
                BUSINESS_NAME: 'String',
                DBA_NAME: 'String',
                CONTACT_FIRST_NAME: 'String',
                CONTACT_LAST_NAME: 'String',
                ADDRESS1: 'String',
                ADDRESS2: 'String',
                CITY: 'String',
                STATE: 'String',
                ZIP: 'String',
                PHONE_NUMBER: 'String',
                EMAIL_ADDRESS: 'String',
                FOREIGN_ADDRES1: 'String',
                FOREIGN_ADDRES2: 'String',
                FOREIGN_ADDRES3: 'String',
                FOREIGN_ADDRES4: 'String',
                FOREIGN_PHONE: 'String',
              },
            },
            ESCROW_ADVANCE: '0',
            FC_OPTIONS: 'String',
            FC_PHONE: 'String',
            FHA_CASE_NUM: 'String',
            FLG_ASSUMABLE: 'true',
            FLG_ATTY_REP: 'true',
            FLG_ESCROW_INCL: 'true',
            FLG_MODIFIED: 'true',
            FLG_NOTE_DESTROYED: 'true',
            FLG_OWNER_OCCUPIED: 'true',
            FLG_PAST_DEBT_COLLECT: 'true',
            FLG_PROP_VACANT: 'true',
            FLG_PROP_INSPECTED: 'true',
            FLG_PREFILE: 'true',
            FLG_SECURITIZED: 'true',
            FLG_TRUST_PERMITS_MODIFICATION: 'true',
            INT_RATE_CURRENT: '0',
            INT_RATE_DEFAULT: '0',
            INTEREST_ADJUST_DATE: '2001-12-17T09:30:47Z',
            INVESTOR_CODE: 'String',
            NY_LANGUAGES: {
              NY_LANGUAGE: 'String',
            },
            LAST_PAYMENT_DATE: '2001-12-17T09:30:47Z',
            LAST_PERIOD_APPLIED: '2001-12-17T09:30:47Z',
            LATE_CHARGE_AMT: '0',
            LENDER_LICENSE: 'String',
            LENDER: 'String',
            LIEN_POSITION: 'String',
            LOAN_CATEGORY: '0',
            LOAN_TERM: '0',
            LOSS_MIT_FAX: 'String',
            LOSS_MIT_HOURS: 'String',
            LOSS_MIT_NAME: 'String',
            MAN_CODE: 'String',
            MORTGAGE_OWNER_DESC: 'String',
            NEXT_DUE_DATE: '2001-12-17T09:30:47Z',
            NO_MODIFICATION_REFERENCE: 'String',
            NOTE_ASSIGNMENT: 'String',
            NOTE_HOLDER: 'String',
            NMLS_NUMBER: 'String',
            NSF_FEES_BALANCE: '0',
            ORIG_DATE: '2001-12-17T09:30:47Z',
            ORIG_LENDER_NAME: 'String',
            ORIG_LOAN_AMOUNT: '0',
            ORIGINATOR_LICENSE: 'String',
            ORIGINATOR: 'String',
            ORIGINATING_OFFICE_CODE: 'String',
            OTHER_DEFAULT_REASON: 'String',
            OTHER_FEES_DUE: '0',
            PAY_BY_DATE: '2001-12-17T09:30:47Z',
            PAYMENT_ADDRESS_CITY: 'String',
            PAYMENT_ADDRESS_STATE: 'String',
            PAYMENT_ADDRESS_ZIP: 'String',
            PAYMENT_ADDRESS: 'String',
            PLSID: 'String',
            PREPAYMENT_PENALTY: '0',
            PRINCIPAL_BALANCE: '0',
            PROPERTYADDRESS1: 'String',
            PROPERTYADDRESS2: 'String',
            PROPERTYCITY: 'String',
            PROPERTYCOUNTY: 'String',
            PROPERTYSTATE: 'String',
            PROPERTYZIP: 'String',
            RECORD_DOCS: 'boolean',
            SCRA_RELEASE_DATE: '2001-12-17T09:30:47Z',
            SECURED_PARTY_PHONE: 'String',
            SECURED_PARTY: 'String',
            SERVICER_EMAIL: 'String',
            SERVICER_PHONE: 'String',
            SERVICER: 'String',
            SPOC_ADDRESS1: 'String',
            SPOC_ADDRESS2: 'String',
            SPOC_CITY: 'String',
            RM_SPOC_EMAIL: 'String',
            RM_SPOC_NAME: 'String',
            RM_SPOC_PHONE_EXT: 'String',
            RM_SPOC_PHONE: 'String',
            SPOC_STATE: 'String',
            RM_SPOC_TITLE: 'String',
            SPOC_ZIP: 'String',
            STEPRATE: 'String',
            TAXS: 'String',
            RETN_INDIVIDUAL_NAME: 'String',
            RETN_INDIVIDUAL_TITLE: 'String',
            STATE_LICENSES: {
              STATE_LICENSE: {
                STATE: 'String',
                NUMBER: 'String',
              },
            },
            TDD_PHONE: 'String',
            TOTAL_AMT_DUE: '0',
            TOTAL_FC_FEES: '0',
            TOTAL_MNTHLY_PYMNT: '0',
            UNAPPLIED_BALANCE: '0',
            VACANT_REASON: 'String',
            VALEDICTION_NAME: 'String',
            WDVA_APPROVAL_DATE: '2001-12-17T09:30:47Z',
            UndefinedUserFields: {
              UndefinedUserField: 'String',
            },
            NamedUndefinedUserFields: {
              NamedUndefinedUserField: {
                Name: 'String',
                Value: 'String',
              },
            },
            Callback_Url: 'TestEndpoint',
            Callback_Url_Version: 'V2',
            APPEAL_DECISION: 'string',
            CHAP7_DISCH_YN: 'string',
            CDE_FOREIGN_LNG: 'string',
            CLOSER: 'string',
            CLOSERTITLE: 'string',
            CORPINCORP1: 'string',
            CASE_NUMBER: 'string',
            ESCROW_SHORTAGE_REPAY_MONTHS: 'int',
            ESCROW_WAIVER: 'boolean',
            FHACASE: 'string',
            FLDCOMMNUM: 'string',
            FLDPARTCOMM: 'boolean',
            FLDMAPCNAME: 'String',
            FLOODREQ: 'boolean',
            HOUSING_MOD: 'boolean',
            LDABBR: 'string',
            LEGAL_DESC: 'string',
            MERS_BM: 'boolean',
            MERSNUM: 'string',
            MERSYN: 'boolean',
            NOTARY_LNG: 'boolean',
            MOD_COSTS: 'decimal',
            MOD_DEF_PRINC_BAL_AMT: 'decimal',
            MOD_DOC_RETURN_DATE: '2001-12-17T09:30:47Z',
            MOD_EFFECTIVE_DATE: '2001-12-17T09:30:47Z',
            MOD_ESCROWS_REQ: 'boolean',
            MOD_HFA_FUNDS: 'decimal',
            MOD_INCENTIVE_AMT: 'decimal',
            MOD_MATURITY_DATE: '2001-12-17T09:30:47Z',
            MOD_MODIFIED_PRINCIPAL_BALANCE: 'decimal',
            MOD_MTG_DATE: '2001-12-17T09:30:47Z',
            MOD_MTG_ORIGINAL_AMOUNT: 'decimal',
            MOD_PARTIAL_CLAIM_AMT: 'decimal',
            MOD_PRA: 'string',
            MOD_PRINC_FORGIVE_AMT: 'decimal',
            MOD_RATE_CHANGE: 'boolean',
            MOD_RECORDING_INFO: 'string',
            MOD_RECORDING_INFO2: 'string',
            MOD_RECORDING_INFO3: 'string',
            MOD_REMAINING_BALANCE: 'decimal',
            MOD_TERM_EXTENDED: 'string',
            MOD_LENDER_NAME: 'string',
            MOD_LENDER_NAME_IN_TITLE: 'string',
            NOOYN: 'boolean',
            NUMBER_OF_UNITS: 'int',
            SPOC_NAME: 'string',
            SPOC_PHONE_EXT: 'string',
            TRUSTEE: 'string',
            TRUSTEE2: 'string',
            PREPAREDBY_INDIVIDUAL_NAME: 'string',
            PREPAREDBY_INDIVIDUAL_TITLE: 'string',
            BANKRUPTCY_YN: 'boolean',
            BRW_FRGN_AD_IN: 'string',
            DEED_SIG_01_POA: 'string',
            DEED_SIG_02_POA: 'string',
            DEED_SIG_03_POA: 'string',
            DEED_SIG_04_POA: 'string',
            DEED_SIG_05_POA: 'string',
            DEED_SIG_06_POA: 'string',
            DEED_SIG_07_POA: 'string',
            DEED_SIG_08_POA: 'string',
            CUSTOM_ITEM: 'string',
            DO_NOT_MAIL: 'string',
            MOBILE_NOTARY: 'boolean',
            DESTADDR: 'boolean',
            SHIP_ADDRESSTOUSE: 'boolean',
            DEED_SIG_01: 'string',
            DEED_SIG_02: 'string',
            DEED_SIG_03: 'string',
            DEED_SIG_04: 'string',
            DEED_SIG_05: 'string',
            DEED_SIG_06: 'string',
            DEED_SIG_07: 'string',
            DEED_SIG_08: 'string',
            MOD_INVESTOR_CODE: 'string',
            DISASTER_YN: 'boolean',
            ESCROW_SHORTAGE: 'decimal',
            DOC_RETURN_DATE: '2001-12-17T09:30:47Z',
            MERS_RIDER3158: 'boolean',
            DE_RESINTATE_PHONE_NUMBER: 'string',
            BKPT_ATRNY_NM_1_TX: 'string',
            BKPT_ATRNY_NM_2_TX: 'string',
            INTEREST_RATE: 'decimal',
            LON: 'string',
            PRINCIPAL_DEFERRAL: 'boolean',
            PROGRAM_TYPE: 'string',
            SERVICE_RELEASE_IND: 'boolean',
            TRIAL_PMT_01: 'decimal',
            TRIAL_PMT_DUE_DATE_01: '2001-12-17T09:30:47Z',
            TRIAL_PMT_02: 'decimal',
            TRIAL_PMT_DUE_DATE_02: '2001-12-17T09:30:47Z',
            TRIAL_PMT_03: 'decimal',
            TRIAL_PMT_DUE_DATE_03: '2001-12-17T09:30:47Z',
            B1PH: 'string',
            BALLOONAMT: 'decimal',
            DEED_VESTING: 'string',
            MOD_PMT_RATE_02: '0.0390500',
            MOD_PMT_RATE_03: 'decimal',
            MOD_PMT_RATE_04: 'decimal',
            MOD_PMT_RATE_05: 'decimal',
            MOD_PMT_RATE_06: 'decimal',
            MOD_PMT_RATE_07: 'decimal',
            MOD_PMT_RATE_08: 'decimal',
            MOD_PMT_DATE_FROM_01: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_02: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_03: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_04: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_05: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_06: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_07: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_08: '2001-12-17T09:30:47Z',
            MOD_PMT_NO_MONTHS_01: 'int',
            MOD_PMT_NO_MONTHS_02: 'int',
            MOD_PMT_NO_MONTHS_03: 'int',
            MOD_PMT_NO_MONTHS_04: 'int',
            MOD_PMT_NO_MONTHS_05: 'int',
            MOD_PMT_NO_MONTHS_06: 'int',
            MOD_PMT_NO_MONTHS_07: 'int',
            MOD_PMT_NO_MONTHS_08: 'int',
            MOD_PMT_YRS_01: 'int',
            MOD_PMT_YRS_02: 'int',
            MOD_PMT_YRS_03: 'int',
            MOD_PMT_YRS_04: 'int',
            MOD_PMT_YRS_05: 'int',
            MOD_PMT_YRS_06: 'int',
            MOD_PMT_YRS_07: 'int',
            MOD_PMT_YRS_08: 'int',
            MOD_PRIN_IMDT_FRGV_AM: 'decimal',
            SSNB1: 'string',
            SSNB2: 'string',
            SSNB3: 'string',
            SSNB4: 'string',
            SSNB5: 'string',
            SSNB6: 'string',
            SSNB7: 'string',
            SSNB8: 'string',
            BALLOON: 'boolean',
            MOD_DPB: 'boolean',
            MOD_EXT_MATURITY_DATE: 'boolean',
            MOD_INT_BEARING_BAL: 'decimal',
            MOD_IR_CHANGE_DATE_01: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_02: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_03: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_04: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_05: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_06: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_07: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_08: '2001-12-17T09:30:47Z',
            MOD_PI_PMT_01: 'decimal',
            MOD_PI_PMT_02: 'decimal',
            MOD_PI_PMT_03: 'decimal',
            MOD_PI_PMT_04: 'decimal',
            MOD_PI_PMT_05: 'decimal',
            MOD_PI_PMT_06: 'decimal',
            MOD_PI_PMT_07: 'decimal',
            MOD_PI_PMT_08: 'decimal',
            MOD_TERM: 'string',
            MOD_UPB_ABV_ORIG: 'boolean',
            MULT_INST: 'boolean',
            SINGLE_INST: 'boolean',
            TOTAL_DPB_PRA: 'decimal',
            PAD: 'string',
            PAD2: 'string',
            PC: 'string',
            PS: 'string',
            PZ: 'string',
            LOANNUMBER: 'string',
            ATRNY_MAIL_ADDR: 'string',
            ATRNY_MAIL_ADDR2: 'string',
            ATRNY_MAIL_CITY: 'string',
            ATRNY_MAIL_STATE: 'string',
            ATRNY_MAIL_ZIP: 'string',
            B1F: 'string',
            B1L: 'string',
            B1MI: 'string',
            B2F: 'string',
            B2L: 'string',
            B2MI: 'string',
            B3F: 'string',
            B3L: 'string',
            B3MI: 'string',
            B4F: 'string',
            B4L: 'string',
            B4MI: 'string',
            B5F: 'string',
            B5L: 'string',
            B5MI: 'string',
            B6F: 'string',
            B6L: 'string',
            B6MI: 'string',
            B7F: 'string',
            B7L: 'string',
            B7MI: 'string',
            B8F: 'string',
            B8L: 'string',
            B8MI: 'string',
            BAD: 'string',
            BAD2: 'string',
            BC: 'string',
            BS: 'string',
            BZ: 'string',
            BRP_IND: 'N',
            CAP_TOTAL: '',
            CASEID: '3516543',
            LOAN_NUMBER: '3468435146',
            EVAL_ID: '32543516',
            CUSTNO: 'string',
            DLY_CNV_IN: 'N',
            DLY_CNV_WVE_AM: '',
            DOCUMENTID: '',
            DOCUMENTNAME: 'string',
            DOCUMENTTYPECODE: '',
            LETTER_ID: 'OP679',
            LITIGATION_IND: '',
            LOANGUID: 'string',
            LOB: 'string',
            MOD_AMORT_TERM: '480',
            MOD_DO_NOT_REC: 'N',
            MOD_ESCROW_ADVANCE: '100.00',
            MOD_ESCROW_PMT_01: '316.67',
            MOD_LPOA: '',
            MOD_PITI_PMT_01: '539.48',
            MOD_PMT_RATE_01: '0.0290500',
            MOD_PROD_ID: 'string',
            MOD_SUSPENSE_FUNDS: '',
            MOD_TOTAL_DUE_FROM_BOR: '0',
            PACKAGE_TYPE: 'BAU_2NDS_STREAMLINE_FINAL',
            PACKAGE_TYPE_OPTION: '',
            PARTITIONCODE: 'GeneratedByJpmc',
            REQUEST_SHIP_DATE: '2001-12-17T09:30:47Z',
            REQUEST_SHIP_VENDOR: 'FEDEX',
            REQUEST_SHIP_VENDOR_RETURN: 'FEDEX',
            SHIP_RECIPIENT_VALIDATEADDRESS: 'N',
            SII_INDICATOR: 'N',
            TAG: 'TagID',
            TOTAL_CORP_ADV: '100.00',
            TRANGUID: 'JPMC-1_C_HEMSP_1212121212_20180724000001',
          },
          ReviewType: 'Internal',
        },
        {
          RequestId: '50063C7C-AC12-4035-9F96-9F4FCADEEC1E',
          DocumentType: 'String',
          ReferenceNumber: 'String',
          Name1: 'TestName1',
          Name2: 'TestName2',
          Name3: 'TestName3',
          Name4: 'String',
          Address1: 'TestAddress1',
          Address2: 'TestAddress2',
          Address3: 'TestAddress3',
          City: 'TestCity',
          State: 'State',
          Zip: 'String',
          UserFields: {
            ACCRUED_LTE_CHRGE_AMT: '0',
            ACTIVITIES: {
              ACTIVITY: {
                ACTIVITY_AMT: '0',
                ACTIVITY_DATE: '2001-12-17T09:30:47Z',
                ACTIVITY_DESC: 'String',
                ACTIVITY_TYPE: 'String',
                MOD_IR_CHANGE_DATE: '2001-12-17T09:30:47Z',
                MOD_PI_PMT: 'decimal',
                MOD_PITI_PMT: 'decimal',
                MOD_PMT_DATE_FROM: '2001-12-17T09:30:47Z',
                MOD_PMT_NO_MONTHS: 'string',
                MOD_PMT_RATE: 'int',
                MOD_PMT_YRS: 'string',
                MOD_ESCROW_PMT_01: 'decimal',
                FRB_PMT_DT: '2001-12-17T09:30:47Z',
              },
            },
            ADVANCE_AMT: '0',
            ARM_RESET_FREQUENCY: '0',
            BK_CASE_NUMBER: 'String',
            BK_STATUS: 'String',
            BK_STAY_RELEASE_DATE: '2001-12-17T09:30:47Z',
            BK_WORKSTATION: 'String',
            CONTACTS: {
              CONTACT: {
                CONTACT_TYPE: 'String',
                FIRST_NAME: 'String',
                MIDDLE_NAME: 'String',
                LAST_NAME: 'String',
                SUFFIX: 'String',
                PHONES: {
                  PHONE: [
                    {
                      NUMBER: '3035559824',
                      TYPE: 'LANDLINE',
                      CONSENT: 'Y',
                    },
                    {
                      NUMBER: '7205559824',
                      TYPE: 'WORK',
                      CONSENT: 'N',
                    },
                    {
                      NUMBER: '9515559824',
                      TYPE: 'MOBILE',
                      CONSENT: 'Y',
                    },
                  ],
                },
                ADDRESS1: 'String',
                ADDRESS2: 'String',
                ADDRESS3: 'String',
                PRIMARY_PHONE: '0000000000',
                CITY: 'String',
                STATE: 'String',
                ZIP: 'String',
                SSN_NUMBER: 'string',
                POA: 'string',
                EMAIL_ADDRESS: 'String',
                EMAIL_CONSENT: 'boolean',
                LANDLINE: 'String',
                LANDLINE_CONSENT: 'Boolean',
                FOREIGN_ADDRES1: 'String',
                FOREIGN_ADDRES2: 'String',
                FOREIGN_ADDRES3: 'String',
                FOREIGN_ADDRES4: 'String',
                FOREIGN_PHONE: 'String',
                ALTMAIL_ADDR: 'String',
                ALTMAIL_ADDR2: 'String',
                ALTMAIL_CITY: 'String',
                ALTMAIL_STATE: 'String',
                ALTMAIL_ZIP: 'String',
              },
            },
            BROKER: 'String',
            BROKER_LICENSE: 'String',
            CDE_FC_REASON: 'String',
            CDE_LOAN_DETAIL: '0',
            CDE_PROPERTY_TYPE: '0',
            CLIENTID: 'String',
            CO_OFFICE_ADDR1: 'String',
            CO_OFFICE_ADDR2: 'String',
            CO_OFFICE_CITY: 'String',
            CO_OFFICE_PHONE: 'String',
            CO_OFFICE_STATE: 'String',
            CO_OFFICE_ZIP: 'String',
            COMPANY_ADDRESS: 'String',
            COMPANY_CITY: 'String',
            COMPANY_DBAS: 'String',
            COMPANY_EMAIL: 'String',
            COMPANY_FAX: 'String',
            COMPANY_HOURS: 'String',
            COMPANY_LOGO_FILENAME: 'String',
            COMPANY_NAME: 'String',
            COMPANY_PHONE: 'String',
            COMPANY_SHORT_NAME: 'String',
            COMPANY_STATE: 'String',
            COMPANY_WEB: 'String',
            COMPANY_ZIP: 'String',
            CORRESPONDENCE_ADDRESS: 'String',
            CORRESPONDENCE_CITY: 'String',
            CORRESPONDENCE_STATE: 'String',
            CORRESPONDENCE_ZIP: 'String',
            DEFAULT_DATE: '2001-12-17T09:30:47Z',
            DELQ_DAYS: '0',
            DELQ_ESCROW_AMT: '0',
            DELQ_INTEREST_AMT: '0',
            DELQ_MONTHS_DUE: '0',
            DELQ_PRINCIPAL_AMT: '0',
            DELQ_PYMNT_AMT: '0',
            DE_REINSTATE_PHONE_NUMBER: 'String',
            ENTITIES: {
              ENTITY: {
                ENTITY_TYPE: 'String',
                BUSINESS_NAME: 'String',
                DBA_NAME: 'String',
                CONTACT_FIRST_NAME: 'String',
                CONTACT_LAST_NAME: 'String',
                ADDRESS1: 'String',
                ADDRESS2: 'String',
                CITY: 'String',
                STATE: 'String',
                ZIP: 'String',
                PHONE_NUMBER: 'String',
                EMAIL_ADDRESS: 'String',
                FOREIGN_ADDRES1: 'String',
                FOREIGN_ADDRES2: 'String',
                FOREIGN_ADDRES3: 'String',
                FOREIGN_ADDRES4: 'String',
                FOREIGN_PHONE: 'String',
              },
            },
            ESCROW_ADVANCE: '0',
            FC_OPTIONS: 'String',
            FC_PHONE: 'String',
            FHA_CASE_NUM: 'String',
            FLG_ASSUMABLE: 'true',
            FLG_ATTY_REP: 'true',
            FLG_ESCROW_INCL: 'true',
            FLG_MODIFIED: 'true',
            FLG_NOTE_DESTROYED: 'true',
            FLG_OWNER_OCCUPIED: 'true',
            FLG_PAST_DEBT_COLLECT: 'true',
            FLG_PROP_VACANT: 'true',
            FLG_PROP_INSPECTED: 'true',
            FLG_PREFILE: 'true',
            FLG_SECURITIZED: 'true',
            FLG_TRUST_PERMITS_MODIFICATION: 'true',
            INT_RATE_CURRENT: '0',
            INT_RATE_DEFAULT: '0',
            INTEREST_ADJUST_DATE: '2001-12-17T09:30:47Z',
            INVESTOR_CODE: 'String',
            NY_LANGUAGES: {
              NY_LANGUAGE: 'String',
            },
            LAST_PAYMENT_DATE: '2001-12-17T09:30:47Z',
            LAST_PERIOD_APPLIED: '2001-12-17T09:30:47Z',
            LATE_CHARGE_AMT: '0',
            LENDER_LICENSE: 'String',
            LENDER: 'String',
            LIEN_POSITION: 'String',
            LOAN_CATEGORY: '0',
            LOAN_TERM: '0',
            LOSS_MIT_FAX: 'String',
            LOSS_MIT_HOURS: 'String',
            LOSS_MIT_NAME: 'String',
            MAN_CODE: 'String',
            MORTGAGE_OWNER_DESC: 'String',
            NEXT_DUE_DATE: '2001-12-17T09:30:47Z',
            NO_MODIFICATION_REFERENCE: 'String',
            NOTE_ASSIGNMENT: 'String',
            NOTE_HOLDER: 'String',
            NMLS_NUMBER: 'String',
            NSF_FEES_BALANCE: '0',
            ORIG_DATE: '2001-12-17T09:30:47Z',
            ORIG_LENDER_NAME: 'String',
            ORIG_LOAN_AMOUNT: '0',
            ORIGINATOR_LICENSE: 'String',
            ORIGINATOR: 'String',
            ORIGINATING_OFFICE_CODE: 'String',
            OTHER_DEFAULT_REASON: 'String',
            OTHER_FEES_DUE: '0',
            PAY_BY_DATE: '2001-12-17T09:30:47Z',
            PAYMENT_ADDRESS_CITY: 'String',
            PAYMENT_ADDRESS_STATE: 'String',
            PAYMENT_ADDRESS_ZIP: 'String',
            PAYMENT_ADDRESS: 'String',
            PLSID: 'String',
            PREPAYMENT_PENALTY: '0',
            PRINCIPAL_BALANCE: '0',
            PROPERTYADDRESS1: 'String',
            PROPERTYADDRESS2: 'String',
            PROPERTYCITY: 'String',
            PROPERTYCOUNTY: 'String',
            PROPERTYSTATE: 'String',
            PROPERTYZIP: 'String',
            RECORD_DOCS: 'boolean',
            SCRA_RELEASE_DATE: '2001-12-17T09:30:47Z',
            SECURED_PARTY_PHONE: 'String',
            SECURED_PARTY: 'String',
            SERVICER_EMAIL: 'String',
            SERVICER_PHONE: 'String',
            SERVICER: 'String',
            SPOC_ADDRESS1: 'String',
            SPOC_ADDRESS2: 'String',
            SPOC_CITY: 'String',
            RM_SPOC_EMAIL: 'String',
            RM_SPOC_NAME: 'String',
            RM_SPOC_PHONE_EXT: 'String',
            RM_SPOC_PHONE: 'String',
            SPOC_STATE: 'String',
            RM_SPOC_TITLE: 'String',
            SPOC_ZIP: 'String',
            STEPRATE: 'String',
            TAXS: 'String',
            RETN_INDIVIDUAL_NAME: 'String',
            RETN_INDIVIDUAL_TITLE: 'String',
            STATE_LICENSES: {
              STATE_LICENSE: {
                STATE: 'String',
                NUMBER: 'String',
              },
            },
            TDD_PHONE: 'String',
            TOTAL_AMT_DUE: '0',
            TOTAL_FC_FEES: '0',
            TOTAL_MNTHLY_PYMNT: '0',
            UNAPPLIED_BALANCE: '0',
            VACANT_REASON: 'String',
            VALEDICTION_NAME: 'String',
            WDVA_APPROVAL_DATE: '2001-12-17T09:30:47Z',
            UndefinedUserFields: {
              UndefinedUserField: 'String',
            },
            NamedUndefinedUserFields: {
              NamedUndefinedUserField: {
                Name: 'String',
                Value: 'String',
              },
            },
            Callback_Url: 'TestEndpoint',
            Callback_Url_Version: 'V2',
            APPEAL_DECISION: 'string',
            CHAP7_DISCH_YN: 'string',
            CDE_FOREIGN_LNG: 'string',
            CLOSER: 'string',
            CLOSERTITLE: 'string',
            CORPINCORP1: 'string',
            CASE_NUMBER: 'string',
            ESCROW_SHORTAGE_REPAY_MONTHS: 'int',
            ESCROW_WAIVER: 'boolean',
            FHACASE: 'string',
            FLDCOMMNUM: 'string',
            FLDPARTCOMM: 'boolean',
            FLDMAPCNAME: 'String',
            FLOODREQ: 'boolean',
            HOUSING_MOD: 'boolean',
            LDABBR: 'string',
            LEGAL_DESC: 'string',
            MERS_BM: 'boolean',
            MERSNUM: 'string',
            MERSYN: 'boolean',
            NOTARY_LNG: 'boolean',
            MOD_COSTS: 'decimal',
            MOD_DEF_PRINC_BAL_AMT: 'decimal',
            MOD_DOC_RETURN_DATE: '2001-12-17T09:30:47Z',
            MOD_EFFECTIVE_DATE: '2001-12-17T09:30:47Z',
            MOD_ESCROWS_REQ: 'boolean',
            MOD_HFA_FUNDS: 'decimal',
            MOD_INCENTIVE_AMT: 'decimal',
            MOD_MATURITY_DATE: '2001-12-17T09:30:47Z',
            MOD_MODIFIED_PRINCIPAL_BALANCE: 'decimal',
            MOD_MTG_DATE: '2001-12-17T09:30:47Z',
            MOD_MTG_ORIGINAL_AMOUNT: 'decimal',
            MOD_PARTIAL_CLAIM_AMT: 'decimal',
            MOD_PRA: 'string',
            MOD_PRINC_FORGIVE_AMT: 'decimal',
            MOD_RATE_CHANGE: 'boolean',
            MOD_RECORDING_INFO: 'string',
            MOD_RECORDING_INFO2: 'string',
            MOD_RECORDING_INFO3: 'string',
            MOD_REMAINING_BALANCE: 'decimal',
            MOD_TERM_EXTENDED: 'string',
            MOD_LENDER_NAME: 'string',
            MOD_LENDER_NAME_IN_TITLE: 'string',
            NOOYN: 'boolean',
            NUMBER_OF_UNITS: 'int',
            SPOC_NAME: 'string',
            SPOC_PHONE_EXT: 'string',
            TRUSTEE: 'string',
            TRUSTEE2: 'string',
            PREPAREDBY_INDIVIDUAL_NAME: 'string',
            PREPAREDBY_INDIVIDUAL_TITLE: 'string',
            BANKRUPTCY_YN: 'boolean',
            BRW_FRGN_AD_IN: 'string',
            DEED_SIG_01_POA: 'string',
            DEED_SIG_02_POA: 'string',
            DEED_SIG_03_POA: 'string',
            DEED_SIG_04_POA: 'string',
            DEED_SIG_05_POA: 'string',
            DEED_SIG_06_POA: 'string',
            DEED_SIG_07_POA: 'string',
            DEED_SIG_08_POA: 'string',
            CUSTOM_ITEM: 'string',
            DO_NOT_MAIL: 'string',
            MOBILE_NOTARY: 'boolean',
            DESTADDR: 'boolean',
            SHIP_ADDRESSTOUSE: 'boolean',
            DEED_SIG_01: 'string',
            DEED_SIG_02: 'string',
            DEED_SIG_03: 'string',
            DEED_SIG_04: 'string',
            DEED_SIG_05: 'string',
            DEED_SIG_06: 'string',
            DEED_SIG_07: 'string',
            DEED_SIG_08: 'string',
            MOD_INVESTOR_CODE: 'string',
            DISASTER_YN: 'boolean',
            ESCROW_SHORTAGE: 'decimal',
            DOC_RETURN_DATE: '2001-12-17T09:30:47Z',
            MERS_RIDER3158: 'boolean',
            DE_RESINTATE_PHONE_NUMBER: 'string',
            BKPT_ATRNY_NM_1_TX: 'string',
            BKPT_ATRNY_NM_2_TX: 'string',
            INTEREST_RATE: 'decimal',
            LON: 'string',
            PRINCIPAL_DEFERRAL: 'boolean',
            PROGRAM_TYPE: 'string',
            SERVICE_RELEASE_IND: 'boolean',
            TRIAL_PMT_01: 'decimal',
            TRIAL_PMT_DUE_DATE_01: '2001-12-17T09:30:47Z',
            TRIAL_PMT_02: 'decimal',
            TRIAL_PMT_DUE_DATE_02: '2001-12-17T09:30:47Z',
            TRIAL_PMT_03: 'decimal',
            TRIAL_PMT_DUE_DATE_03: '2001-12-17T09:30:47Z',
            B1PH: 'string',
            BALLOONAMT: 'decimal',
            DEED_VESTING: 'string',
            MOD_PMT_RATE_02: '0.0390500',
            MOD_PMT_RATE_03: 'decimal',
            MOD_PMT_RATE_04: 'decimal',
            MOD_PMT_RATE_05: 'decimal',
            MOD_PMT_RATE_06: 'decimal',
            MOD_PMT_RATE_07: 'decimal',
            MOD_PMT_RATE_08: 'decimal',
            MOD_PMT_DATE_FROM_01: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_02: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_03: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_04: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_05: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_06: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_07: '2001-12-17T09:30:47Z',
            MOD_PMT_DATE_FROM_08: '2001-12-17T09:30:47Z',
            MOD_PMT_NO_MONTHS_01: 'int',
            MOD_PMT_NO_MONTHS_02: 'int',
            MOD_PMT_NO_MONTHS_03: 'int',
            MOD_PMT_NO_MONTHS_04: 'int',
            MOD_PMT_NO_MONTHS_05: 'int',
            MOD_PMT_NO_MONTHS_06: 'int',
            MOD_PMT_NO_MONTHS_07: 'int',
            MOD_PMT_NO_MONTHS_08: 'int',
            MOD_PMT_YRS_01: 'int',
            MOD_PMT_YRS_02: 'int',
            MOD_PMT_YRS_03: 'int',
            MOD_PMT_YRS_04: 'int',
            MOD_PMT_YRS_05: 'int',
            MOD_PMT_YRS_06: 'int',
            MOD_PMT_YRS_07: 'int',
            MOD_PMT_YRS_08: 'int',
            MOD_PRIN_IMDT_FRGV_AM: 'decimal',
            SSNB1: 'string',
            SSNB2: 'string',
            SSNB3: 'string',
            SSNB4: 'string',
            SSNB5: 'string',
            SSNB6: 'string',
            SSNB7: 'string',
            SSNB8: 'string',
            BALLOON: 'boolean',
            MOD_DPB: 'boolean',
            MOD_EXT_MATURITY_DATE: 'boolean',
            MOD_INT_BEARING_BAL: 'decimal',
            MOD_IR_CHANGE_DATE_01: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_02: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_03: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_04: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_05: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_06: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_07: '2001-12-17T09:30:47Z',
            MOD_IR_CHANGE_DATE_08: '2001-12-17T09:30:47Z',
            MOD_PI_PMT_01: 'decimal',
            MOD_PI_PMT_02: 'decimal',
            MOD_PI_PMT_03: 'decimal',
            MOD_PI_PMT_04: 'decimal',
            MOD_PI_PMT_05: 'decimal',
            MOD_PI_PMT_06: 'decimal',
            MOD_PI_PMT_07: 'decimal',
            MOD_PI_PMT_08: 'decimal',
            MOD_TERM: 'string',
            MOD_UPB_ABV_ORIG: 'boolean',
            MULT_INST: 'boolean',
            SINGLE_INST: 'boolean',
            TOTAL_DPB_PRA: 'decimal',
            PAD: 'string',
            PAD2: 'string',
            PC: 'string',
            PS: 'string',
            PZ: 'string',
            LOANNUMBER: 'string',
            ATRNY_MAIL_ADDR: 'string',
            ATRNY_MAIL_ADDR2: 'string',
            ATRNY_MAIL_CITY: 'string',
            ATRNY_MAIL_STATE: 'string',
            ATRNY_MAIL_ZIP: 'string',
            B1F: 'string',
            B1L: 'string',
            B1MI: 'string',
            B2F: 'string',
            B2L: 'string',
            B2MI: 'string',
            B3F: 'string',
            B3L: 'string',
            B3MI: 'string',
            B4F: 'string',
            B4L: 'string',
            B4MI: 'string',
            B5F: 'string',
            B5L: 'string',
            B5MI: 'string',
            B6F: 'string',
            B6L: 'string',
            B6MI: 'string',
            B7F: 'string',
            B7L: 'string',
            B7MI: 'string',
            B8F: 'string',
            B8L: 'string',
            B8MI: 'string',
            BAD: 'string',
            BAD2: 'string',
            BC: 'string',
            BS: 'string',
            BZ: 'string',
            BRP_IND: 'N',
            CAP_TOTAL: '',
            CASEID: '865465',
            LOAN_NUMBER: '461356515649',
            EVAL_ID: '3546315',
            CUSTNO: 'string',
            DLY_CNV_IN: 'N',
            DLY_CNV_WVE_AM: '',
            DOCUMENTID: '',
            DOCUMENTNAME: 'string',
            DOCUMENTTYPECODE: '',
            LETTER_ID: 'OP679',
            LITIGATION_IND: '',
            LOANGUID: 'string',
            LOB: 'string',
            MOD_AMORT_TERM: '480',
            MOD_DO_NOT_REC: 'N',
            MOD_ESCROW_ADVANCE: '100.00',
            MOD_ESCROW_PMT_01: '316.67',
            MOD_LPOA: '',
            MOD_PITI_PMT_01: '539.48',
            MOD_PMT_RATE_01: '0.0290500',
            MOD_PROD_ID: 'string',
            MOD_SUSPENSE_FUNDS: '',
            MOD_TOTAL_DUE_FROM_BOR: '0',
            PACKAGE_TYPE: 'BAU_2NDS_STREAMLINE_FINAL',
            PACKAGE_TYPE_OPTION: '',
            PARTITIONCODE: 'GeneratedByJpmc',
            REQUEST_SHIP_DATE: '2001-12-17T09:30:47Z',
            REQUEST_SHIP_VENDOR: 'FEDEX',
            REQUEST_SHIP_VENDOR_RETURN: 'FEDEX',
            SHIP_RECIPIENT_VALIDATEADDRESS: 'N',
            SII_INDICATOR: 'N',
            TAG: 'TagID',
            TOTAL_CORP_ADV: '100.00',
            TRANGUID: 'JPMC-1_C_HEMSP_1212121212_20180724000001',
          },
          ReviewType: 'Internal',
        },
      ],
      invalidCases: [
        {
          caseId: '354654',
          message: "CaseId doesn't exist",
        },
        {
          caseId: '545656',
          message: 'Case is not Active',
        },
      ],
    };

    if (response !== null) {
      yield put({
        type: SET_COVIUS_BULK_UPLOAD_RESULT,
        payload: response,
      });
    } else {
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: LEVEL_ERROR,
          status: 'This loan do not exist or currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: LEVEL_ERROR,
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
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
          level: LEVEL_ERROR,
          status: 'This loan do not exist or currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
        },
      });
    }
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        level: LEVEL_ERROR,
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
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

function* manualInsertion(payload) {
  try {
    yield put({ type: SHOW_LOADER });
    const response = yield all(payload.payload.map(evalId => call(Api.callPost, '/api/disposition/bulk/insertEval', { evalId })));
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
        level: LEVEL_ERROR,
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
      },
    });
  }
  yield put({ type: HIDE_LOADER });
}


const onUploadingFile = function* onUploadingFile(action) {
  const file = action.payload;
  if (file) {
    const data = yield call(processExcel, file);
    if (data) {
      yield put({
        type: SAVE_PROCESSED_FILE,
        payload: data,
      });
    }
  }
};

const onFileSubmit = function* onFileSubmit(action) {
  const eventCategory = action.payload;
  try {
    const file = yield select(selectors.getUploadedFile);
    // const evalId = yield select(selectors.evalId);
    // console.log(evalId);
    const fileUploadResponse = {};
    const response = yield call(Api.callPost, 'api/stager/dashboard/handleUpload', JSON.parse(file));
    const message = {};
    message.title = 'One or more Case Ids have failed validation and the data was not sent to Covius. Please review the Upload Failed tab to view the failed items.';
    message.msg = '';
    const hasData = R.has('data');
    if (response.status === 200) {
      fileUploadResponse.message = (hasData(response) && R.isEmpty(response.data.uploadFailed)) || R.equals(eventCategory, 'FulfillmentRequest') ? 'The request was successfully sent to Covius' : message;
      fileUploadResponse.level = (hasData(response) && R.isEmpty(response.data.uploadFailed)) || R.equals(eventCategory, 'FulfillmentRequest') ? 'Success' : 'Failed';
      fileUploadResponse.eventCategory = `${eventCategory} success`;
      yield put({
        type: GET_COVIUS_DATA,
        payload: response.data,
      });
    } else {
      const failedMessage = {
        title: 'The request failed to send to Covius',
        msg: 'Unable to convert the file to correct format. Please reupload and try again. If the issue continues, please reach out to the CMOD Support team',
      };
      fileUploadResponse.message = failedMessage;
      fileUploadResponse.level = 'Failed';
      fileUploadResponse.eventCategory = `${eventCategory} failed`;
    }
    yield put({
      type: GET_SUBMIT_RESPONSE,
      payload: fileUploadResponse,
    });
  } catch (e) {
    yield put(
      {
        type: GET_SUBMIT_RESPONSE,
        payload: { message: { title: '', msg: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.' }, level: 'Failed', eventCategory: `${eventCategory} failed` },
      },
    );
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
      type: SET_DOWNLOAD_RESPONSE,
      payload: {
        message: 'Excel File Downloaded Sucessfully',
        level: 'Success',
      },
    });
  } catch (e) {
    yield put({
      type: SET_DOWNLOAD_RESPONSE,
      payload: {
        message: 'The conversion to excel has failed. Please reach out to the CMOD Support team to troubleshoot.',
        level: 'Failed',
      },
    });
  }
};

function* watchPopulateEventsDropDown() {
  yield takeEvery(POPULATE_EVENTS_DROPDOWN, populateDropdown);
}

function* watchCoviusBulkOrder() {
  yield takeEvery(PROCESS_COVIUS_BULK, onCoviusBulkUpload);
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

export const TestExports = {
  autoSaveOnClose,
  checklistSelectors,
  endShift,
  errorFetchingChecklistDetails,
  fetchChecklistDetails: fetchChecklistDetailsForGetNext,
  saveDisposition,
  setExpandView,
  processExcel,
  saveGeneralChecklistDisposition,
  searchLoan,
  selectEval,
  unassignLoan,
  assignLoan,
  watchAutoSave,
  watchEndShift,
  watchSetExpandView,
  watchGetNext,
  getNext,
  onUploadingFile,
  onFileSubmit,
  onDownloadFile,
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
};

export const combinedSaga = function* combinedSaga() {
  yield all([
    watchAutoSave(),
    watchDispositionSave(),
    watchGetNext(),
    watchSetExpandView(),
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
    watchContinueMyReview(),
    watchAddDocsInReceived(),
    watchOnSelectReject(),
    watchOnSearchWithTask(),
    watchOnSelectModReversal(),
    watchManualInsertion(),
    watchCompleteMyReview(),
    watchOnTrialTask(),
    watchCoviusBulkOrder(),
    watchOnUploadFile(),
    watchOnSubmitFile(),
    watchOnDownloadFile(),
    watchPopulateEventsDropDown(),
  ]);
};

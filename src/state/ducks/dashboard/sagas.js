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
import AppGroupName from 'models/AppGroupName';
import EndShift from 'models/EndShift';
import ChecklistErrorMessageCodes from 'models/ChecklistErrorMessageCodes';
import { POST_COMMENT_SAGA } from '../comments/types';
import selectors from './selectors';
// import { mockData } from '../../../containers/LoanActivity/LoanActivity';
import {
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
  RESOLUTION_DROP_DOWN_VALUES,
  COMPLETE_MY_REVIEW,
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
  { LEVEL_ERROR, LEVEL_SUCCESS, MSG_VALIDATION_SUCCESS },
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
    const response = yield call(Api.callPost, '/api/disposition/validate-disposition', request);
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
  return {
    loanNumber,
    evalId,
    taskId,
    taskIterationCounter,
    piid,
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
    if (response !== null) {
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

export const TestExports = {
  autoSaveOnClose,
  checklistSelectors,
  endShift,
  errorFetchingChecklistDetails,
  fetchChecklistDetails: fetchChecklistDetailsForGetNext,
  saveDisposition,
  setExpandView,
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
    watchCompleteMyReview(),

  ]);
};

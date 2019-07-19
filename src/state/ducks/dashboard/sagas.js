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
import RouteAccess from 'lib/RouteAccess';
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
  TASKS_LIMIT_EXCEEDED,
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
  SET_RESULT_OPERATION,
  CONTINUE_MY_REVIEW,
  CONTINUE_MY_REVIEW_RESULT,
} from './types';
import { errorTombstoneFetch } from './actions';
import {
  getTasks,
  resetChecklistData,
  storeProcessDetails,
} from '../tasks-and-checklist/actions';
import {
  ERROR_LOADING_CHECKLIST,
  ERROR_LOADING_TASKS,
} from '../tasks-and-checklist/types';

const appGroupNameToUserPersonaMap = {
  'feuw-task-checklist': 'FEUW',
  'beuw-task-checklist': 'BEUW',
};

function getUserPersona(appGroupName) {
  const persona = appGroupNameToUserPersonaMap[appGroupName];
  if (persona === undefined) {
    return appGroupName;
  }
  return persona;
}

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
};

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

function* shouldRetriveChecklist(searchItem) {
  const checklistTaskNames = ['FrontEnd Review', 'Processing', 'Underwriting', 'Document Generation'];
  const groupList = yield select(loginSelectors.getGroupList);
  const hasChecklistAccess = RouteAccess.hasChecklistAccess(groupList);
  const taskName = R.path(['payload', 'taskName'], searchItem);
  const isChecklistTask = checklistTaskNames.includes(taskName);
  const retriveChecklist = hasChecklistAccess && isChecklistTask;
  return retriveChecklist;
}

function* fetchChecklistDetailsForSearchResult(searchItem) {
  const retriveChecklist = yield call(shouldRetriveChecklist, searchItem);
  if (retriveChecklist) {
    const checklistId = R.pathOr('', ['payload', 'taskCheckListId'], searchItem);
    yield call(fetchChecklistDetails, checklistId);
  }
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

function* selectEval(searchItem) {
  const evalDetails = R.propOr({}, 'payload', searchItem);
  yield put(resetChecklistData());
  const user = yield select(loginSelectors.getUser);
  const { userDetails } = user;
  evalDetails.isAssigned = false;
  let assignedTo = [];
  const name = userDetails.email ? userDetails.email.toLowerCase().split('@')[0].split('.') : null;
  assignedTo = name[0].concat(' ', name[1]);
  evalDetails.showContinueMyReview = !R.isNil(evalDetails.assignee)
  && assignedTo === evalDetails.assignee.toLowerCase();
  yield put({ type: SAVE_EVALID_LOANNUMBER, payload: evalDetails });
  yield call(fetchChecklistDetailsForSearchResult, searchItem);
  // fetch loan activity details from api
  // if (R.equals(evalDetails.taskName, 'Trial Modification')
  //  || R.equals(evalDetails.taskName, 'Forbearance')) {
  //   yield call(fetchLoanActivityDetails, searchItem);
  // }
  try {
    yield put(tombstoneActions.fetchTombstoneData());
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
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    if (taskId) {
      const response = yield call(Api.callPost, `/api/workassign/updateTaskStatus?evalId=${evalId}&assignedTo=${userPrincipalName}&taskStatus=${taskStatusUpdate}&taskId=${taskId}`, {});
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

function* watchContinueMyReview() {
  yield takeEvery(CONTINUE_MY_REVIEW, continueMyReviewResult);
}


const validateDisposition = function* validateDiposition(dispositionPayload) {
  try {
    yield put({ type: SHOW_SAVING_LOADER });
    const payload = R.propOr({}, 'payload', dispositionPayload);
    const disposition = R.propOr({}, 'dispositionReason', payload);
    const groupName = getUserPersona(R.propOr({}, 'group', payload));
    const evalId = yield select(selectors.evalId);
    const wfTaskId = yield select(selectors.taskId);
    const userName = yield select(checklistSelectors.getAgentName);
    const wfProcessId = yield select(selectors.processId);
    const processStatus = yield select(selectors.processStatus);
    const validateAgent = !R.isNil(userName) && !R.isEmpty(userName);
    const request = {
      evalId,
      disposition,
      groupName,
      validateAgent,
      userName,
      wfTaskId,
      wfProcessId,
      processStatus,
    };
    const response = yield call(Api.callPost, '/api/disposition/validate-disposition', request);
    const { tkamsValidation, skillValidation } = response;
    yield put({
      type: SET_GET_NEXT_STATUS,
      payload: tkamsValidation.enableGetNext,
    });
    if (!tkamsValidation.enableGetNext) {
      yield put({
        type: USER_NOTIF_MSG,
        payload: {
          type: 'error',
          data: tkamsValidation.discrepancies,
        },
      });
    } else {
      let message = 'Validation successful!';
      if (validateAgent) {
        ({ message } = skillValidation);
      }
      yield put({
        type: USER_NOTIF_MSG,
        payload: {
          type: 'success',
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
    const group = getUserPersona(R.propOr({}, 'group', payload));
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
    loanNumber, evalId, taskId, taskIterationCounter, piid,
  };
}

function getCommentPayload(taskDetails) {
  const loanNumber = getLoanNumber(taskDetails);
  const processId = getProcessId(taskDetails);
  const evalId = getEvalId(taskDetails);
  const taskId = R.path(['taskData', 'data', 'id'], taskDetails);
  return {
    applicationName: 'CMOD', processIdType: 'WF_PRCS_ID', loanNumber, processId, evalId, taskId,
  };
}

function* saveChecklistDisposition(payload) {
  const { appGroupName } = payload;
  if (!payload.isFirstVisit && AppGroupName.hasChecklist(appGroupName)) {
    const evalId = yield select(selectors.evalId);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const groupName = getUserPersona(payload.appGroupName);
    const agentName = yield select(checklistSelectors.getAgentName);
    const wfTaskId = yield select(selectors.taskId);
    const wfProcessId = yield select(selectors.processId);
    const processStatus = yield select(selectors.processStatus);
    const validateAgent = !R.isNil(agentName) && !R.isEmpty(agentName);
    const disposition = payload.dispositionCode;
    const request = {
      evalId,
      disposition,
      groupName,
      validateAgent,
      userName: validateAgent ? agentName : userPrincipalName,
      wfTaskId,
      wfProcessId,
      processStatus,
    };
    const saveResponse = yield call(Api.callPost, '/api/disposition/checklistDisposition', request);
    const { tkamsValidation, skillValidation } = saveResponse;
    yield put({
      type: SET_GET_NEXT_STATUS,
      payload: tkamsValidation.enableGetNext,
    });
    if (!tkamsValidation.enableGetNext) {
      yield put({ type: HIDE_LOADER });
      yield put({
        type: USER_NOTIF_MSG,
        payload: {
          type: 'error',
          data: tkamsValidation.discrepancies,
        },
      });
      return false;
    }
    let message = 'Validation successful!';
    let type = 'success';
    if (validateAgent) {
      type = skillValidation.hasSkill ? 'success' : 'error';
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
  if (!AppGroupName.hasChecklist(appGroupName)) {
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
    if (yield call(saveChecklistDisposition, action.payload)) {
      const allTasksComments = yield select(checklistSelectors.getTaskComment);
      const dispositionComment = yield select(checklistSelectors.getDispositionComment);
      if (dispositionComment) {
        yield put({ type: POST_COMMENT_SAGA, payload: dispositionComment });
      }
      yield put(resetChecklistData());
      const { appGroupName } = action.payload;
      const user = yield select(loginSelectors.getUser);
      const userPrincipalName = R.path(['userDetails', 'email'], user);
      const groupList = R.pathOr([], ['groupList'], user);
      const taskDetails = yield call(Api.callGet, `api/workassign/getNext?appGroupName=${appGroupName}&userPrincipalName=${userPrincipalName}&userGroups=${groupList}`);
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
        yield call(fetchChecklistDetailsForGetNext, taskDetails, action.payload);
        yield put({ type: SAVE_EVALID_LOANNUMBER, payload: evalPayload });
        yield put(tombstoneActions.fetchTombstoneData(loanNumber));
        yield put(commentsActions.loadCommentsAction(commentsPayLoad));
        yield put({ type: HIDE_LOADER });
      } else if (!R.isNil(R.path(['messsage'], taskDetails))) {
        yield put({ type: TASKS_NOT_FOUND, payload: { noTasksFound: true } });
        yield put(errorTombstoneFetch());
        yield call(errorFetchingChecklistDetails);
      } else if (!R.isNil(R.path(['limitExceeded'], taskDetails))) {
        yield put({ type: TASKS_LIMIT_EXCEEDED, payload: { isTasksLimitExceeded: true } });
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
  if (AppGroupName.hasChecklist(groupName)) {
    yield put({ type: SHOW_LOADER });
    const payload = {};
    payload.appGroupName = groupName;
    payload.isFirstVisit = yield select(selectors.isFirstVisit);
    payload.dispositionCode = yield select(checklistSelectors.getDispositionCode);
    if (yield call(saveChecklistDisposition, payload)) {
      const dispositionComment = yield select(checklistSelectors.getDispositionComment);
      if (dispositionComment) {
        yield put({ type: POST_COMMENT_SAGA, payload: dispositionComment });
      }
      yield put(resetChecklistData());
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
    const response = yield call(Api.callPost, `/api/workassign/unassignLoan?evalId=${evalId}&assignedTo=${userPrincipalName}&loanNumber=${loanNumber}&taskId=${taskId}&processId=${processId}&processStatus=${processStatus}`, {});
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
    const response = yield call(Api.callPost, `/api/workassign/assignLoan?evalId=${evalId}&assignedTo=${userPrincipalName}&loanNumber=${loanNumber}&taskId=${taskId}&processId=${processId}&processStatus=${processStatus}&groupName=${groupName}&userGroups=${userGroups}`, {});
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
        level: 'error',
        status: message,
      },
    });
  } else {
    yield put({
      type: SET_TASK_UNDERWRITING_RESULT,
      payload: {
        level: 'error',
        status: 'Either the Eval case is not in Approved status or the Resolution case is not in a Closed status in Remedy.'
        + ' If authorized, please click Send to Underwriting button, or update Remedy to appropriate state.',
      },
    });
  }
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
              level: 'success',
              status: 'Trail has been Sent to Underwriting',
            },
          });
        } else {
          yield put({
            type: SET_TASK_UNDERWRITING_RESULT,
            payload: {
              level: 'error',
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
            level: 'error',
            status: message,
          },
        });
      }
    } else {
      const message = 'Unable to send back to Underwriting because Trial task is not active.';
      yield put({
        type: SET_TASK_UNDERWRITING_RESULT,
        payload: { level: 'error', status: message },
      });
    }
    yield put({ type: HIDE_LOADER });
  } catch (e) {
    yield put({
      type: SET_TASK_UNDERWRITING_RESULT,
      payload:
      {
        level: 'error',
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
      },
    });
  }
}

function* sendToDocGen(payload) {
  // const taskId = yield select(selectors.taskId);
  const evalId = yield select(selectors.evalId);
  const isStager = payload.payload;
  try {
    yield put({ type: SHOW_LOADER });
    const response = yield call(Api.callGet, `/api/cmodnetcoretkams/DocGen/DocGen${isStager ? 'Stager' : ''}?EvalId=${evalId}`);
    if (response !== null && response === true) {
      const payload1 = JSON.parse(`{
        "evalid": "${evalId}",
        "eventname": "sendToDocGen${isStager ? 'Stager' : ''}"
      }`);
      const responseSend = yield call(Api.callPost, '/api/release/api/process/activate2', payload1);
      const currentStatus = responseSend && responseSend.updateInstanceStatusResponse.statusCode;
      if (currentStatus !== null && currentStatus === '200') {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: 'success',
            status: `The loan has been successfully sent back to Doc Gen ${isStager ? 'Stager' : ' queue for rework'}`,
          },
        });
      } else {
        yield put({
          type: SET_RESULT_OPERATION,
          payload: {
            level: 'error',
            status: 'Invalid Event or Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
          },
        });
      }
    } else {
      const message = `Unable to send back to Doc Gen ${isStager ? 'Stager' : ''}. Eval status should be Approved, and the Eval Sub Status should be Referral or Referral KB and the most recent Resolution case (within the eval) Status should ${isStager ? 'be Open' : 'not be Open or Rejected'}`;
      yield put({
        type: SET_RESULT_OPERATION,
        payload: {
          level: 'error',
          status: message,
        },
      });
    }
    yield put({ type: HIDE_LOADER });
  } catch (e) {
    yield put({
      type: SET_RESULT_OPERATION,
      payload:
      {
        level: 'error',
        status: 'Currently one of the services is down. Please try again. If you still facing this issue, please reach out to IT team.',
      },
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

export const TestExports = {
  autoSaveOnClose,
  checklistSelectors,
  endShift,
  errorFetchingChecklistDetails,
  fetchChecklistDetails: fetchChecklistDetailsForGetNext,
  saveDisposition,
  setExpandView,
  saveChecklistDisposition,
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
  watchContinueMyReview,
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
    watchContinueMyReview(),
  ]);
};

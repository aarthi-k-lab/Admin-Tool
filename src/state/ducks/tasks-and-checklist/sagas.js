/* eslint-disable no-param-reassign */
import {
  takeEvery,
  all,
  call,
  put,
  select,
} from 'redux-saga/effects';
import * as R from 'ramda';
import * as Api from 'lib/Api';
import { ERROR, FAILED } from 'constants/common';
import ChecklistErrorMessageCodes from 'models/ChecklistErrorMessageCodes';
import {
  SET_LAST_UPDATED,
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
  STORE_OPTIONAL_TASKS,
  STORE_MISC_TASK_COMMENT,
  DISP_COMMENT_SAGA,
  DISP_COMMENT,
  UPDATE_CHECKLIST,
  CLEAR_SUBTASK,
  HISTORICAL_CHECKLIST_DATA,
  GET_HISTORICAL_CHECKLIST_DATA,
  ERROR_LOADING_HISTORICAL_CHECKLIST,
  FETCH_DROPDOWN_OPTIONS_SAGA,
  SAVE_DROPDOWN_DATA,
  GET_RESOLUTION_ID_STATS,
  SLA_RULES_PROCESSED,
  SAVE_RULE_RESPONSE,
  SET_NEW_CHECKLIST,
  PUSH_DATA,
  CHECK_RULES_PASSED,
  PUT_DROPDOWN_DATA,
  FETCH_MONTHLY_EXPENSE_VALUES,
  SAVE_MONTHLY_EXPENSE_VALUES,
  SAVE_FICO_HISTORY,
  FETCH_FICO_HISTORY,
  SAVE_FICO_SCORE,
  SET_FICO_SCORE,
  FICO_LOCK,
  SET_ASSET_DETAILS,
  SAVE_ASSET_DETAILS,
  SET_RADIO_STATE_DETAIL,
  ASSET_LOCK,
  FETCH_ASSET_HISTORIES,
  SAVE_ASSET_HISTORIES,
  FETCH_ASSET_HISTORY_FOR_ASSET_ID,
  SAVE_ASSET_HISTORY_BY_ID,
} from './types';
import {
  USER_NOTIF_MSG,
  SET_GET_NEXT_STATUS,
  SET_RESULT_OPERATION,
  DISABLE_PUSHDATA,
  TOGGLE_LOCK_BUTTON,
  SET_POPUP_DATA,
  CHECKLIST_NOT_FOUND,
} from '../dashboard/types';
import {
  SET_SNACK_BAR_VALUES,
} from '../notifications/types';
import * as actions from './actions';
import selectors from './selectors';
import {
  selectors as dashboardSelectors,
} from '../dashboard';
import {
  selectors as incomeSelectors,
} from '../income-calculator';
import {
  selectors as loginSelectors,
} from '../login';
import DashboardModel from '../../../models/Dashboard/index';
import {
  SOMETHING_WENT_WRONG,
} from '../../../models/Alert';
import {
  ASSUMPTOR, CONTRIBUTOR,
} from '../../../constants/frontEndChecklist';
// import DropDownSelect from 'containers';
const {
  Messages: {
    MSG_SERVICE_DOWN,
    LEVEL_FAILED,
  },
} = DashboardModel;

const ADD = 'ADD';
// const DELETE = 'DELETE';
const MISCTSK_CHK2 = 'MISCTSK_CHK2';
const autoDispositions = [{
  dispositionCode: 'allTasksCompleted',
  dispositionComment: 'All Tasks Completed',
}, {
  dispositionCode: 'approval',
  dispositionComment: 'approval',
}];

const BOOKING_DEPTH = 4;

function* getChecklist(action) {
  try {
    const {
      payload: {
        taskId,
      },
    } = action;
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
    const lastUpdated = `${new Date()}`;
    yield put({ type: SET_LAST_UPDATED, payload: { lastUpdated } });
  } catch (e) {
    yield put({
      type: ERROR_LOADING_CHECKLIST,
    });
    const snackBar = {
      message: 'Checklist fetch failed.',
      type: ERROR,
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
      R.map(checklist => ({
        id: R.prop('_id', checklist),
        state: R.prop('state', checklist),
      })),
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
    let {
      payload: {
        depth,
      },
    } = action;
    yield put({
      type: LOADING_TASKS,
    });
    yield put({
      type: USER_NOTIF_MSG,
      payload: {},
    });
    const rootTaskId = yield select(selectors.getRootTaskId);
    const groupName = yield select(dashboardSelectors.groupName);
    depth = groupName === DashboardModel.BOOKING ? BOOKING_DEPTH : depth;
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
    } else if (!R.isNil(yield select(selectors.getChecklistComment))) {
      const showDisposition = yield select(selectors.shouldShowDisposition);
      yield put(actions.validationDisplayAction(showDisposition));
    } else yield put(actions.validationDisplayAction(false));
    const lastUpdated = `${new Date()}`;
    yield put({ type: SET_LAST_UPDATED, payload: { lastUpdated } });
  } catch (e) {
    yield put({
      type: ERROR_LOADING_TASKS,
    });
    const snackBar = {};
    snackBar.message = 'Task/s fetch failed.';
    snackBar.type = ERROR;
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
  snackBar.type = ERROR;
  snackBar.open = true;
  yield put({
    type: SET_SNACK_BAR_VALUES,
    payload: snackBar,
  });
}

function* handleGetHistoricalChecklistError(e) {
  yield put({
    type: ERROR_LOADING_HISTORICAL_CHECKLIST,
  });
  const snackBar = {
    open: true,
    message: `Get Historical Checklist failed: ${e.message}`,
    type: ERROR,
  };
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
      payload: {},
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
    payload: {
      depth: 3,
    },
  });
}

function* updateChecklist(action) {
  try {
    const {
      task,
      fieldName,
      type,
    } = action.payload;
    const requestBody = {
      // eslint-disable-next-line no-underscore-dangle
      id: task.id ? task.id : task._id,
    };
    if (type === ADD) {
      yield* updateAndFetchTasks(fieldName, task, requestBody, type);
    } else {
      const rootTaskId = yield select(selectors.getRootTaskId);
      const clearSubTaskRequestBody = {
        // eslint-disable-next-line no-underscore-dangle
        id: task.subTasks[0] ? task.subTasks[0]._id : task._id,
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

function* getHistoricalChecklistData(action) {
  try {
    const {
      taskId,
    } = action.payload;
    const response = yield call(Api.callGet, `/api/dataservice/api/getTaskDetailsForTaskIds/${taskId}`);
    yield put({
      type: HISTORICAL_CHECKLIST_DATA,
      payload: response,
    });
  } catch (e) {
    yield call(handleGetHistoricalChecklistError, e);
  }
}

function* subTaskClearance(action) {
  try {
    const {
      id,
      rootTaskId,
      taskBlueprintCode,
    } = action.payload;
    const requestBody = {
      id,
      rootTaskId,
      taskBlueprintCode,
    };
    const response = yield call(Api.put, '/api/task-engine/task/clearSubTask', requestBody);
    const didErrorOccur = response === null;
    if (didErrorOccur) {
      throw new Error('Api call failed');
    } else {
      yield put({
        type: GET_CHECKLIST_SAGA,
        payload: {
          taskId: id,
        },
      });
      yield put({
        type: GET_TASKS_SAGA,
        payload: {
          depth: 3,
        },
      });
    }
  } catch (e) {
    yield call(handleSaveChecklistError, e);
  }
}

function* sortUniqueUsers(usersList) {
  const currentUser = yield select(loginSelectors.getUser);
  const currentUserMail = R.path(['userDetails', 'email'], currentUser);
  return R.concat([{
    displayName: '',
    id: '',
  }], R.sortBy(a => a.displayName,
    R.filter(user => user.userPrincipalName !== currentUserMail, R.uniq(usersList))));
}

function* getUsersForGroup(additionalInfo) {
  const {
    group,
  } = additionalInfo;
  const response = yield call(Api.callGet, 'api/config');
  const handoffADGroups = R.pathOr({}, ['handoffADGroups', group], response);
  const appName = R.pathOr({}, ['appName', 'appName'], response);
  const requestData = {
    url: '/api/auth/ad/usersByGroups',
    method: Api.callPost,
    body: {
      groups: handoffADGroups,
      appName,
    },
    formatResponse: sortUniqueUsers,
  };
  return requestData;
}

function* getExpenseValues() {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const requestData = {
    url: `/api/tkams/search/BorrowerExpense/${loanNumber}`,
    method: Api.callGet,
  };
  return requestData;
}

function getDataFromColValMap(additionalInfo) {
  const { value, columnName } = additionalInfo;
  const requestData = {
    url: `/api/dataservice/api/colValMap/${columnName}?actvInd=Y&searchTerm=${value}`,
    method: Api.callGet,
    formatResponse: R.pluck('val'),
  };
  return requestData;
}

function getDropDownWithOptions(additionalInfo) {
  const { options: defaultOptions } = additionalInfo;
  return {
    defaultOptions,
    formatResponse: R.clone,
  };
}

const sourceToMethodMapping = {
  adgroup: getUsersForGroup,
  OLTP: getDataFromColValMap,
  TKAMS: getExpenseValues,
  dropdownSelect: getDropDownWithOptions,
};

function* getMonthlyExpenseValues(action) {
  const {
    source, selector: selectorName,
  } = action.payload;
  const selector = selectorName || null;
  const dataFetchMethod = sourceToMethodMapping[source];
  const requestData = yield dataFetchMethod();
  const {
    url,
    method,
    body,
  } = requestData;
  const options = yield call(method, url, body);
  if (options) {
    const data = {
      options,
      selector: selector || ['monthlyExpenseValues'],
    };
    try {
      yield put({
        type: SAVE_MONTHLY_EXPENSE_VALUES,
        payload: data,
      });
    } catch (e) {
      yield call(handleSaveChecklistError, e);
    }
  }
}

function* getdropDownOptions(action) {
  let options;
  const {
    source,
    additionalInfo,
  } = action.payload;
  const selector = R.propOr(null, 'selector', additionalInfo);
  const dataFetchMethod = sourceToMethodMapping[source];
  const requestData = yield dataFetchMethod(additionalInfo);
  const {
    url,
    method,
    body,
    formatResponse,
    defaultOptions,
  } = requestData;
  if (defaultOptions) {
    options = defaultOptions;
  } else {
    options = yield call(method, url, body);
  }
  if (options) {
    const formattedOptions = yield formatResponse(options);
    const data = {
      formattedOptions,
      selector: selector || ['dropDownOptions'],
    };
    try {
      yield put({
        type: SAVE_DROPDOWN_DATA,
        payload: data,
      });
    } catch (e) {
      yield call(handleSaveChecklistError, e);
    }
  }
}

function* putDropDownOptions(action) {
  try {
    const {
      columnName, value,
    } = action.payload;
    const payload = {
      actvInd: 'Y',
      audCreByNm: 'CMODUI',
      audCreDttm: new Date(),
      cmnt: '',
      colNm: columnName,
      val: value,

    };
    yield call(Api.callPost, '/api/dataservice/api/colValMap/', payload);
  } catch (e) {
    yield call(handleSaveChecklistError, e);
  }
}

const sendToLSAMS = function* sendToLSAMS() {
  try {
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const evalId = yield select(dashboardSelectors.evalId);
    const taskId = yield select(dashboardSelectors.getBookingTaskId);
    const currentUser = yield select(loginSelectors.getUser);
    const currentUserMail = R.path(['userDetails', 'email'], currentUser);
    const payload = {
      loanNumber,
      evalId,
      taskId,
      applicationName: 'CMOD',
      user: currentUserMail,
    };
    const response = yield call(Api.callPost, '/api/booking/api/bookingAutomation/loadToLSAMS', payload);
    yield put({ type: DISABLE_PUSHDATA, payload: !R.equals(response.status, 'FAILED') });
    yield put({
      type: SET_RESULT_OPERATION,
      payload: {
        status: response.message,
        level: R.equals(response.status, 'FAILED') ? LEVEL_FAILED : 'Success',
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

function* addPushDataResponse() {
  try {
    const requestBody = {
      value: {
        pushDataChecklist: true,
      },
    };
    yield put({
      type: SLA_RULES_PROCESSED,
      payload: false,
    });
    yield put({
      type: LOADING_CHECKLIST,
    });
    const rootTaskId = yield select(selectors.getRootTaskId);
    yield call(Api.put, `/api/task-engine/task/${rootTaskId}`, requestBody);
    const selectedChecklistId = yield select(selectors.getSelectedChecklistId);
    yield all([
      callAndPut(actions.setSelectedChecklist, selectedChecklistId),
      callAndPut(actions.getChecklist, selectedChecklistId),
    ]);
    yield put(yield call(actions.getTasks));
    yield call(sendToLSAMS);
  } catch (err) {
    yield call(handleSaveChecklistError, err);
  } finally {
    yield put({
      type: SLA_RULES_PROCESSED,
      payload: true,
    });
  }
}

function getGroup(group) {
  return group === DashboardModel.ALL_STAGER ? DashboardModel.POSTMODSTAGER : group;
}

function* makeResolutionIdStatCall(action) {
  try {
    const {
      resolutionId,
      auditRuleType,
    } = action.payload;
    yield put({
      type: SLA_RULES_PROCESSED,
      payload: false,
    });
    const groupName = yield select(dashboardSelectors.groupName);
    const group = getGroup(groupName);
    const taskId = yield select(dashboardSelectors.getBookingTaskId);
    const response = yield call(Api.callPost, `/api/booking/api/bookingAutomation/runAuditRules?resolutionId=${resolutionId}&auditRuleType=${auditRuleType}`);
    if (R.equals(group, 'BOOKING')) {
      const disablePushData = yield call(Api.callGet, `/api/dataservice/api/getLsamsResponseByTaskId?taskId=${taskId}`);
      yield put({ type: DISABLE_PUSHDATA, payload: disablePushData });
    }
    if (!R.isNil(response) && !R.isEmpty(response) && !response.message && !response.error) {
      try {
        const rootTaskId = yield select(selectors.getRootTaskId);
        const request = R.compose(
          R.pluck('data'),
          R.path(['modBookingResponse', 'checklist']),
        )(response);
        const isAllRulesPassed = (request.map((obj) => {
          const dup = JSON.parse(JSON.stringify(obj));
          delete dup.text;
          return Object.values(dup)[0];
        })).includes('false');
        if (R.equals(auditRuleType, 'pre')) {
          yield put({ type: CHECK_RULES_PASSED, payload: !isAllRulesPassed });
        }
        const requestBody = {
          value: {
            [auditRuleType]: {
              ruleResult: request,
              resolutionId,
              lastUpdate: new Date().toISOString(),
            },
          },
        };
        yield call(Api.put, `/api/task-engine/task/${rootTaskId}`, requestBody);
        const selectedChecklistId = yield select(selectors.getSelectedChecklistId);
        yield all([
          callAndPut(actions.setSelectedChecklist, selectedChecklistId),
          callAndPut(actions.getChecklist, selectedChecklistId),
        ]);
        yield put(yield call(actions.getTasks));
      } catch (err) {
        yield call(handleSaveChecklistError, err);
      }
    }
    yield put({
      type: SAVE_RULE_RESPONSE,
      // eslint-disable-next-line no-nested-ternary
      payload: R.isNil(response) || R.isEmpty(response)
        ? {
          error: SOMETHING_WENT_WRONG,
        } : (response.error ? {
          error: response.error,
        } : response),
    });
  } catch (err) {
    yield put({
      type: SAVE_RULE_RESPONSE,
      payload: {
        error: SOMETHING_WENT_WRONG,
      },
    });
  } finally {
    yield put({
      type: SLA_RULES_PROCESSED,
      payload: true,
    });
  }
}

function* setNewChecklist(action) {
  try {
    const groupName = yield select(dashboardSelectors.groupName);
    const depth = groupName === DashboardModel.BOOKING ? BOOKING_DEPTH : 3;
    yield put({
      type: LOADING_TASKS,
    });
    yield put({
      type: USER_NOTIF_MSG,
      payload: {},
    });
    const {
      rootTaskId,
    } = action.payload.id;
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
    let selectedChecklistId = action.payload.id.checklistId;
    if (checklistSelectionIsPresent === 'nothing') {
      selectedChecklistId = action.payload.id.checklistId;
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
    } else if (!R.isNil(yield select(selectors.getChecklistComment))) {
      const showDisposition = yield select(selectors.shouldShowDisposition);
      yield put(actions.validationDisplayAction(showDisposition));
    } else yield put(actions.validationDisplayAction(false));
  } catch (e) {
    yield put({
      type: ERROR_LOADING_TASKS,
    });
    const snackBar = {};
    snackBar.message = 'Task/s fetch failed.';
    snackBar.type = ERROR;
    snackBar.open = true;
    yield put({
      type: SET_SNACK_BAR_VALUES,
      payload: snackBar,
    });
  }
}

function* updateAndSaveChecklist(payload) {
  try {
    const { key, validationMessage } = payload;
    const taskTree = yield select(selectors.getTaskTree);
    const checklistId = yield select(selectors.getProcessId);
    const task = R.find(R.propEq('taskBlueprintCode', 'EXT_CHG'))(taskTree.subTasks);
    const { _id, value } = task;
    yield call(Api.put, `/api/task-engine/task/${_id}`, { value: { ...value, [key]: validationMessage } });
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
    yield put(actions.storeProcessDetails(checklistId, rootTaskId));
    yield put(actions.getTasks());
  } catch (e) {
    yield put({
      type: CHECKLIST_NOT_FOUND,
      payload: {
        messageCode: ChecklistErrorMessageCodes.CHECKLIST_FETCH_FAILED,
      },
    });
  }
}

function* fetchFicoHistory() {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const updatedFicoTableData = yield call(Api.callGet, `/api/dataservice/fico/fico-history/${loanNumber}`);
  yield put({ type: SAVE_FICO_HISTORY, payload: updatedFicoTableData });
}

function* setFicoScore(action) {
  const { position, value } = action.payload;
  const ficoScoreData = yield select(selectors.getFicoScoreData);
  const isPresent = R.find(R.propEq('position', (position)))(ficoScoreData);
  const ficoScoreValue = parseInt(value, 10);
  const decimalValidation = R.is(Number, ficoScoreValue) && !Number.isInteger(ficoScoreValue)
   && !R.isNil(value) && !R.isEmpty(value);
  if (decimalValidation) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        message: 'Fico Score is not a decimal number. ',
        level: 'Error',
        title: 'Lock Calculation',
      },
    });
  } else {
    if (isPresent) {
      const newData = ficoScoreData.map((d) => {
        if (d.position === position) {
          d.ficoScore = ficoScoreValue;
        }
        return d;
      });
      yield put({
        type: SAVE_FICO_SCORE,
        payload: newData,
      });
    } else {
      const newData = [...ficoScoreData, { position, ficoScore: ficoScoreValue }];
      yield put({
        type: SAVE_FICO_SCORE,
        payload: newData,
      });
    }
    if (ficoScoreValue !== 0 && !R.isNil(value) && !R.isEmpty(value)) {
      yield put({
        type: TOGGLE_LOCK_BUTTON,
        payload: { enable: true, selectedChecklistLock: '' },
      });
    } else {
      yield put({
        type: TOGGLE_LOCK_BUTTON,
        payload: { enable: false, selectedChecklistLock: '' },
      });
    }
  }
}

function* ficoLockCalculation() {
  try {
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const borrowers = yield select(incomeSelectors.getBorrowers);
    const evalId = yield select(dashboardSelectors.evalId);
    const ficoScoreData = yield select(selectors.getFicoScoreData);
    let ficolockRequest = [];
    let tkamsResponse = null;
    ficolockRequest = ficoScoreData.map(data => ({
      loanNbr: loanNumber,
      position: data.position,
      userName: userPrincipalName,
      ficoScore: data.ficoScore,
      evalId,
    }));
    ficolockRequest = ficolockRequest.filter(d => d.ficoScore !== 0 && !R.isNil(d.ficoScore));
    const response = yield call(Api.callPost, '/api/dataservice/fico/insertFicoDetails', ficolockRequest);
    ficolockRequest.map((e) => {
      borrowers.map((x) => {
        if (x.borrowerPstnNumber === e.position) {
          e.description = x.description;
        }
        return null;
      });
      return null;
    });
    const filteredRequest = R.filter(x => !x.description.includes(ASSUMPTOR)
    && !x.description.includes(CONTRIBUTOR), ficolockRequest);
    const ficolockRequestTkams = filteredRequest.map(data => ({
      loanNbr: data.loanNbr,
      position: data.position,
      userName: userPrincipalName,
      ficoScore: data.ficoScore,
    }));
    if (ficolockRequestTkams && ficolockRequestTkams.length > 0) {
      tkamsResponse = yield call(Api.callPost, '/api/tkams/fico/saveFicoData', ficolockRequestTkams);
    }
    if ((R.equals((R.propOr(null, 'status', response), 'Success')))) {
      yield put({
        type: TOGGLE_LOCK_BUTTON,
        payload: { enable: false, selectedChecklistLock: '' },
      });
      yield put({ type: FETCH_FICO_HISTORY });
      yield put({
        type: SET_POPUP_DATA,
        payload: {
          message: 'Fico Score is Locked successfully in CMOD',
          level: 'Success',
          title: 'Lock Calculation',
        },
      });
      if ((filteredRequest && filteredRequest.length > 0) && !R.equals(R.propOr(null, 'saveStatus', tkamsResponse), true)) {
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: `Failed to save in TKAMS : ${tkamsResponse.errorMessage}`,
            level: 'Error',
            title: 'Lock Calculation',
          },
        });
      }
      yield call(updateAndSaveChecklist, { key: 'ficoLockSuccess', validationMessage: true });
    }
  } catch (e) {
    yield put({
      type: SET_POPUP_DATA,
      payload: {
        message: 'Something went wrong. Please try after some time. ',
        level: 'Error',
        title: 'Lock Calculation',
      },
    });
  }
}


function* setAssetDetail(action) {
  const { value, key, selectedBorrower } = action.payload;
  const assetData = yield select(selectors.getAssetDetails);
  const isPresent = R.find(R.propEq('borrValue', selectedBorrower))(assetData);
  let newData = [];
  if (isPresent) {
    newData = assetData.map((d) => {
      if (d.borrValue === selectedBorrower) {
        d[key] = value;
      }
      return d;
    });
    yield put({
      type: SAVE_ASSET_DETAILS,
      payload: newData,
    });
  } else {
    const data = {
      borrValue: selectedBorrower,
    };
    data[key] = value;
    newData = [...assetData, data];
    yield put({
      type: SAVE_ASSET_DETAILS,
      payload: newData,
    });
  }
  const enableLockButton = R.any((data) => {
    if ((!R.isNil(data.checkingAccount) && !R.isEmpty(data.checkingAccount))
    || (!R.isNil(data.savingsAccount) && !R.isEmpty(data.savingsAccount))
    || (!R.isNil(data.ira) && !R.isEmpty(data.ira))
    || (!R.isNil(data.stocks) && !R.isEmpty(data.stocks))
    ) {
      return true;
    }
    return false;
  }, newData);
  if (enableLockButton) {
    yield put({
      type: TOGGLE_LOCK_BUTTON,
      payload: { enable: true, selectedChecklistLock: '' },
    });
  } else {
    yield put({
      type: TOGGLE_LOCK_BUTTON,
      payload: { enable: false, selectedChecklistLock: '' },
    });
  }
}

function* setRadioOptionInAsset(action) {
  const { value, key, selectedBorrower } = action.payload;
  const assetData = yield select(selectors.getAssetDetails);
  const isPresent = R.find(R.propEq('borrValue', selectedBorrower))(assetData);
  if (isPresent) {
    const newData = assetData.map((d) => {
      if (d.borrValue === selectedBorrower) {
        d[key] = value;
      }
      return d;
    });
    yield put({
      type: SAVE_ASSET_DETAILS,
      payload: newData,
    });
  } else {
    const data = {
      borrValue: selectedBorrower,
    };
    data[key] = value;
    const newData = [...assetData, data];
    yield put({
      type: SAVE_ASSET_DETAILS,
      payload: newData,
    });
  }
}

const checkDuplicatesInAsset = (assetData) => {
  const data = R.map(R.omit(['selectedState']), assetData);
  const hasRepeatedValueOtherThanZero = (arr) => {
    const keys = Object.keys(arr[0]);
    const len = arr.length;
    for (let i = 1; i < len; i += 1) {
      for (let j = 0; j < keys.length; j += 1) {
        const key = keys[j];
        if (arr[i][key] !== '0' && arr[i][key] !== '' && arr[i][key] === arr[i - 1][key]) {
          return true;
        }
      }
    }
    return false;
  };
  return hasRepeatedValueOtherThanZero(data);
};

function* assetLockCalculation() {
  try {
    let assetData = yield select(selectors.getAssetDetails);
    const loanNumber = yield select(dashboardSelectors.loanNumber);
    const borrowers = yield select(incomeSelectors.getBorrowers);
    const user = yield select(loginSelectors.getUser);
    const userPrincipalName = R.path(['userDetails', 'email'], user);
    const evalId = yield select(dashboardSelectors.evalId);
    const borrValueList = borrowers.map(borr => `${borr.firstName}_${borr.borrowerPstnNumber}`);
    const isDuplicates = checkDuplicatesInAsset(assetData);
    if (!isDuplicates) {
      assetData = assetData.map(data => ({
        borrValue: data.borrValue,
        checkingAccount: data.checkingAccount ? parseFloat(data.checkingAccount, 10) : 0,
        savingsAccount: data.savingsAccount ? parseFloat(data.savingsAccount, 10) : 0,
        ira: data.ira ? parseFloat(data.ira, 10) : 0,
        stocks: data.stocks ? parseFloat(data.stocks, 10) : 0,
        selectedState: data.selectedState ? data.selectedState : 'Verified',
      }));
      let assetLockRequest = borrValueList.map((value) => {
        const asset = R.find(R.propEq('borrValue', value))(assetData);
        if (asset) {
          return asset;
        }
        return {
          borrValue: value,
          savingsAccount: 0,
          checkingAccount: 0,
          ira: 0,
          stocks: 0,
          selectedState: 'Verified',
        };
      });
      const borrDetails = yield call(Api.callGet, `/api/dataservice/incomeCalc/borrower/${loanNumber}`);
      const borrIdDetails = {};
      borrDetails.map((borr) => {
        if (borr) {
          borrIdDetails[`${borr.firstName}_${borr.borrowerPstnNumber}`] = borr.borrowerId;
        }
        return null;
      });
      const assetId = Math.floor(1000 + Math.random() * 9000);
      assetLockRequest = assetLockRequest.map(d => ({
        ...d,
        borrId: borrIdDetails[d.borrValue],
        assetId,
        userName: userPrincipalName,
      }));
      const assetLockResponse = yield call(Api.callPost, '/api/dataservice/asset/assetLockCalculation', assetLockRequest);
      if ((R.equals((R.propOr(null, 'status', assetLockResponse), 'Success')))) {
        yield put({
          type: SET_POPUP_DATA,
          payload: {
            message: 'Asset Verification is Locked successfully',
            level: 'Success',
            title: 'Lock Calculation',
          },
        });
        const mappedAssetLockRequest = R.map((x) => {
          const borrData = R.find(R.propEq('borrowerId', x.borrId))(borrDetails);
          return {
            ...x,
            borrowerAffilCd: borrData.borrowerAffilCd,
          };
        }, assetLockRequest);
        if (mappedAssetLockRequest) {
          if (mappedAssetLockRequest.length > 0) {
            const saveToTkamsPayload = {
              borrowerAssetList: mappedAssetLockRequest,
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
        yield put({ type: FETCH_ASSET_HISTORIES });
        yield call(updateAndSaveChecklist, { key: 'assetLockSuccess', validationMessage: true });
        yield put({
          type: TOGGLE_LOCK_BUTTON,
          payload: { enable: false, selectedChecklistLock: '' },
        });
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
}

function* fetchAssetHistory() {
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const assetHistoryData = yield call(Api.callGet, `/api/dataservice/asset/fetchHistories/${loanNumber}`);
  yield put({ type: SAVE_ASSET_HISTORIES, payload: assetHistoryData });
}

function* fetchAssetHistoryById(action) {
  const { assetId } = action.payload;
  const loanNumber = yield select(dashboardSelectors.loanNumber);
  const assetHistoryDataById = yield call(Api.callGet, `/api/dataservice/asset/fetchHistory/${assetId}`);
  const borrDetails = yield call(Api.callGet, `/api/dataservice/incomeCalc/borrower/${loanNumber}`);
  const borrIdDetails = {};
  borrDetails.map((borr) => {
    if (borr) {
      borrIdDetails[borr.borrowerId] = `${borr.firstName}_${borr.borrowerPstnNumber}`;
    }
    return null;
  });
  const newData = assetHistoryDataById.map(d => ({
    ...d,
    borrValue: borrIdDetails[d.borrId],
    selectedState: d.selectedState === 'N/A' ? 'Verified' : d.selectedState,
  }));
  yield put({ type: SAVE_ASSET_HISTORY_BY_ID, payload: newData });
}

function* watchChecklistItemChange() {
  yield takeEvery(HANDLE_CHECKLIST_ITEM_CHANGE, handleChecklistItemChange);
}

function* watchGetChecklist() {
  yield takeEvery(GET_CHECKLIST_SAGA, getChecklist);
}

function* watchGetHistoricalChecklistData() {
  yield takeEvery(GET_HISTORICAL_CHECKLIST_DATA, getHistoricalChecklistData);
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

function* watchMonthlyExpenseValues() {
  yield takeEvery(FETCH_MONTHLY_EXPENSE_VALUES, getMonthlyExpenseValues);
}

function* watchPutDropDownOption() {
  yield takeEvery(PUT_DROPDOWN_DATA, putDropDownOptions);
}

function* watchResolutionIdStatCall() {
  yield takeEvery(GET_RESOLUTION_ID_STATS, makeResolutionIdStatCall);
}

function* watchSetNewChecklist() {
  yield takeEvery(SET_NEW_CHECKLIST, setNewChecklist);
}

function* watchPushDataButton() {
  yield takeEvery(PUSH_DATA, addPushDataResponse);
}

function* watchFetchFicoHistory() {
  yield takeEvery(FETCH_FICO_HISTORY, fetchFicoHistory);
}

function* watchSetFicoScore() {
  yield takeEvery(SET_FICO_SCORE, setFicoScore);
}

function* watchFicoLock() {
  yield takeEvery(FICO_LOCK, ficoLockCalculation);
}

function* watchSetAssetDetail() {
  yield takeEvery(SET_ASSET_DETAILS, setAssetDetail);
}

function* watchSetRadioSelectDetail() {
  yield takeEvery(SET_RADIO_STATE_DETAIL, setRadioOptionInAsset);
}

function* watchAssetLock() {
  yield takeEvery(ASSET_LOCK, assetLockCalculation);
}

function* watchFetchAssetHistories() {
  yield takeEvery(FETCH_ASSET_HISTORIES, fetchAssetHistory);
}

function* watchFetchAssetHistoryById() {
  yield takeEvery(FETCH_ASSET_HISTORY_FOR_ASSET_ID, fetchAssetHistoryById);
}

export const TestExports = {
  watchGetTasks,
  getTasks,
  filterOptionalTasks,
  createChecklistNavigation,
  watchPushDataButton,
  addPushDataResponse,
  sendToLSAMS,
};

export function* combinedSaga() {
  yield all([
    watchPutDropDownOption(),
    watchChecklistItemChange(),
    watchGetChecklist(),
    watchGetNextChecklist(),
    watchGetPrevChecklist(),
    watchGetTasks(),
    watchDispositionComment(),
    watchUpdateChecklist(),
    watchGetHistoricalChecklistData(),
    watchSubtaskClearance(),
    watchDropDownOption(),
    watchResolutionIdStatCall(),
    watchSetNewChecklist(),
    watchPushDataButton(),
    watchMonthlyExpenseValues(),
    watchFetchFicoHistory(),
    watchSetFicoScore(),
    watchFicoLock(),
    watchSetAssetDetail(),
    watchSetRadioSelectDetail(),
    watchAssetLock(),
    watchFetchAssetHistories(),
    watchFetchAssetHistoryById(),
  ]);
  // eslint-disable-next-line eol-last
}

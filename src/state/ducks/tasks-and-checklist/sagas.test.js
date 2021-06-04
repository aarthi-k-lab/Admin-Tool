import
{
  put, takeEvery, select, call,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';

import { selectors as loginSelectors } from 'ducks/login/index';
import { TestExports } from './sagas';
import selectors from './selectors';
import dashboardSelectors from '../dashboard/selectors';
import {
  SET_RESULT_OPERATION,
  USER_NOTIF_MSG,
  DISABLE_PUSHDATA,
} from '../dashboard/types';

import * as actions from './actions';

import {
  LOADING_CHECKLIST,
  PUSH_DATA,
  GET_TASKS_SAGA,
  LOADING_TASKS,
  STORE_OPTIONAL_TASKS,
  STORE_CHECKLIST_NAVIGATION,
  STORE_TASKS,
  VALIDATION_DISPLAY,
  SLA_RULES_PROCESSED,
} from './types';

describe('watch submitFile ', () => {
  it('should trigger submit file worker', () => {
    const saga = cloneableGenerator(TestExports.watchPushDataButton)();
    expect(saga.next().value)
      .toEqual(takeEvery(PUSH_DATA, TestExports.addPushDataResponse));
  });
});

describe('push data to Lsams is being called', () => {
  const taskId = 'jksr33k234';
  const requestBody = {
    value: {
      pushDataChecklist: true,
    },
  };
  const checklistId = '5f31116887d90e1016fdecfc';
  const saga = cloneableGenerator(TestExports.addPushDataResponse)();
  it('Activate Loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: SLA_RULES_PROCESSED, payload: false }));
    expect(saga.next().value)
      .toEqual(put({ type: LOADING_CHECKLIST }));
  });

  it('should get the root task id from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getRootTaskId));
  });

  it('should call task engined service to add into value object', () => {
    expect(saga.next(taskId).value)
      .toEqual(call(Api.put, `/api/task-engine/task/${taskId}`, requestBody));
  });

  it('should get the selected checklist id from store', () => {
    expect(saga.next(checklistId).value)
      .toEqual(select(selectors.getSelectedChecklistId));
  });

  it('should set the selected checklist id', () => {
    expect(saga.next(checklistId).done).toEqual(false);
  });
  it('getting the related task after the checklist id is set', () => {
    expect(saga.next(checklistId).value)
      .toEqual(call(actions.getTasks));
  });
  it('send to lsams function is called out', () => {
    expect(saga.next(TestExports.sendToLSAMS).value)
      .toEqual(put(TestExports.sendToLSAMS));
  });
  it('send to lsams function is called out 1', () => {
    expect(saga.next(TestExports.sendToLSAMS).value)
      .toEqual(call(TestExports.sendToLSAMS));
  });
  it('setting the sla rules processing to true', () => {
    expect(saga.next().value)
      .toEqual(put({ type: SLA_RULES_PROCESSED, payload: true }));
  });
});

describe('make an lsams call', () => {
  const requestBody = {
    loanNumber: 382477,
    evalId: 3289497,
    taskId: 329874,
    applicationName: 'CMOD',
    user: 'xyz@mrcooper.com',
  };
  const mockResponse = {
    level: 'Success',
    status: 'successfully sent to lsams',
  };
  const mockUser = {
    userDetails: {
      email: 'xyz@mrcooper.com',
    },
  };
  const lsamsResponse = {
    status: 'PASSED',
    message: 'successfully sent to lsams',
  };
  const saga = cloneableGenerator(TestExports.sendToLSAMS)();
  it('should get the loanNumber from store', () => {
    expect(saga.next().value)
      .toEqual(select(dashboardSelectors.loanNumber));
  });
  it('should get the evalId from store', () => {
    expect(saga.next(382477).value)
      .toEqual(select(dashboardSelectors.evalId));
  });
  it('should get the task id from store', () => {
    expect(saga.next(3289497).value)
      .toEqual(select(dashboardSelectors.getBookingTaskId));
  });

  it('should get the user from store', () => {
    expect(saga.next(329874).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call task engined service to add into value object', () => {
    expect(saga.next(mockUser).value)
      .toEqual(call(Api.callPost, '/api/booking/api/bookingAutomation/loadToLSAMS', requestBody));
  });

  it('disable the push data and set the status', () => {
    expect(saga.next(lsamsResponse).value)
      .toEqual(put({ type: DISABLE_PUSHDATA, payload: true }));
  });

  it('set the response to result operation', () => {
    expect(saga.next().value)
      .toEqual(put({ type: SET_RESULT_OPERATION, payload: mockResponse }));
  });
});

describe('watch getTasks ', () => {
  it('should trigger getTasks saga', () => {
    const saga = cloneableGenerator(TestExports.watchGetTasks)();
    expect(saga.next().value)
      .toEqual(takeEvery(GET_TASKS_SAGA, TestExports.getTasks));
  });
});

describe('getTask sagas is being called', () => {
  const taskId = '123456';
  const action = {
    payload: {
      depth: 2,
    },
  };
  const {
    payload: {
      depth,
    },
  } = action;
  const mockMath = Object.create(global.Math);
  mockMath.random = () => 0.162387;
  global.Math = mockMath;
  const response = {
    _id: '5f31116887d90e1016fdecfc',
    appCode: 'CMOD',
    processBlueprintCode: 'BEUWGENDISPv1.6',
    processInstance: '5f31116887d90e0050fdecfb',
    state: 'in-progress',
    subTasks: [{
      __v: 0,
      _id: '5f31116887d90e1199fdecfe',
      appCode: 'CMOD',
      dependencyType: 'required',
      processBlueprintCode: 'BEUWGENDISPv1.6',
      processInstance: '5f31116887d90e0050fdecfb',
      state: 'in-progress',
      taskBlueprintCode: 'OTCM',
      visibility: true,
      taskBlueprint: {
        __v: 0,
        _id: '5df23c97db631811ef03997c',
        appCode: 'CMOD',
        description: 'Review Checklist',
        name: 'Review Checklist',
        taskCode: 'OTCM',
      },
    }],
    taskBlueprint: {
      __v: 0,
      _id: '5e5795b0f0c84924629e9edc',
      appCode: 'CMOD',
      description: 'BEUW',
      name: 'BEUW',
      taskCode: 'BEUW',
    },
    taskBlueprintCode: 'BEUW',
  };
  const checklistId = '5f31116887d90ecebdfded01';
  const checklistNavigation = {
    '5f31116887d90ecebdfded01': {
      next: undefined,
      prev: undefined,
    },
    nothing: {
      next: '5f31116887d90ecebdfded01',
      prev: undefined,
    },
  };
  const checklistNavAction = {
    payload: checklistNavigation,
    type: STORE_CHECKLIST_NAVIGATION,
  };
  const saga = cloneableGenerator(TestExports.getTasks)(action);
  it('Activate Loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: LOADING_TASKS }));
  });
  it('Clear user notification message', () => {
    expect(saga.next().value)
      .toEqual(put({ type: USER_NOTIF_MSG, payload: {} }));
  });
  it('should get the root task id from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getRootTaskId));
  });
  it('should get the groupName from store', () => {
    expect(saga.next(taskId).value)
      .toEqual(select(dashboardSelectors.groupName));
  });
  it('should call task engine service to get Tasks', () => {
    expect(saga.next('').value)
      .toEqual(call(Api.callGet, `/api/task-engine/task/${taskId}?depth=${depth}&forceNoCache=0.162387`));
  });
  it('should filter the optional tasks', () => {
    expect(saga.next(response).value)
      .toEqual(call(TestExports.filterOptionalTasks, response));
  });
  it('store the optional tasks', () => {
    expect(saga.next([]).value)
      .toEqual(put({ type: STORE_OPTIONAL_TASKS, payload: [] }));
  });
  it('should call Checklist navigation', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.createChecklistNavigation, response));
  });
  it('store the navigated checklist', () => {
    expect(saga.next(checklistNavigation).value).toEqual(call(
      actions.storeChecklistNavigation, checklistNavigation,
    ));
  });
  it('should get the selected checklist id ', () => {
    expect(saga.next(checklistNavAction).value)
      .toEqual(select(selectors.getSelectedChecklistId));
  });
  it('call and put the action the checklist ID', () => {
    expect(saga.next(checklistId).value).toEqual(put(
      { type: STORE_CHECKLIST_NAVIGATION, payload: checklistNavigation },
    ));
    expect(saga.next(response).value).toEqual(put({ type: STORE_TASKS, payload: response }));
  });
  it('get the checklist comments from selectors', () => {
    expect(saga.next(response).value)
      .toEqual(select(selectors.getChecklistComment));
    expect(saga.next().value)
      .toEqual(put({ type: VALIDATION_DISPLAY, payload: false }));
  });
});

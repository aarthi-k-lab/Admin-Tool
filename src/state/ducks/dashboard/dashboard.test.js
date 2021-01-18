import {
  put, call, takeEvery, take, fork, select, all,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import { selectors as loginSelectors } from 'ducks/login/index';
import { selectors as checklistSelectors } from 'ducks/tasks-and-checklist/index';
import { ERROR_LOADING_TOMBSTONE_DATA } from 'ducks/tombstone/types';
import * as actionTypes from './types';
import {
  onExpandView, dispositionSave, clearDisposition, clearFirstVisit,
} from './actions';
import { TestExports } from './sagas';
import selectors from './selectors';
import {
  resetChecklistData,
} from '../tasks-and-checklist/actions';
import { POST_COMMENT_SAGA } from '../comments/types';
import { GET_HISTORICAL_CHECKLIST_DATA } from '../tasks-and-checklist/types';
import DashboardModel from '../../../models/Dashboard';

const {
  Messages:
  {
    MSG_SERVICE_DOWN,
    LEVEL_FAILED,
    LEVEL_SUCCESS,
    LEVEL_ERROR,
  },
} = DashboardModel;

const mockComment = {
  MISC_TSK_CHK2: {
    applicationName: 'AppName',
    loanNumber: 'LoanNumber',
    processIdType: 'ProcIdType',
    processId: 'WF_PRCS_ID',
    eventName: 'EventName',
    comment: 'test',
    userName: 'Deepan Kumaresan',
    taskId: '1234',
    createdDate: new Date().toJSON(),
    commentContext: JSON.stringify({
      TASK: 'MISC',
      TASK_ID: '656565656567',
      TASK_ACTN: 'wait',
      DSPN_IND: 1,
    }),
  },
};

describe('expand view ', () => {
  it('should toggle expandView State', () => {
    const saga = cloneableGenerator(TestExports.setExpandView)();
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.SET_EXPAND_VIEW,
        payload: undefined,
      }));
  });
});

describe('watch autoSave ', () => {
  it('should trigger autoSaveOnClose worker', () => {
    const saga = cloneableGenerator(TestExports.watchAutoSave)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.AUTO_SAVE_OPERATIONS, TestExports.autoSaveOnClose));
  });
});

describe('autoSaveOnClose saga ', () => {
  const handleBrowserEventPayload = {
    payload: 'Paused',
  };
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
  };
  const saga = cloneableGenerator(TestExports.autoSaveOnClose)(handleBrowserEventPayload);

  it('should call select evalId from store', () => {
    expect(saga.next(handleBrowserEventPayload.payload).value)
      .toEqual(select(selectors.evalId));
  });

  it('should call select user from store', () => {
    expect(saga.next(1883281).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call select taskId from store', () => {
    expect(saga.next(mockUser).value)
      .toEqual(select(selectors.taskId));
  });

  it('should call validation service', () => {
    expect(saga.next(123456).value)
      .toEqual(call(Api.callPost, '/api/workassign/updateTaskStatus?evalId=1883281&assignedTo=bren@mrcooper.com&taskStatus=Paused&taskId=123456', {}));
  });

  it('should call AUTO_SAVE_TRIGGER', () => {
    expect(saga.next('Accepted').value)
      .toEqual(put({ type: actionTypes.AUTO_SAVE_TRIGGER, payload: 'Task Status Update Success' }));
  });
});

describe('watch getnext ', () => {
  it('should trigger getnext worker', () => {
    const saga = cloneableGenerator(TestExports.watchGetNext)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.GET_NEXT, TestExports.getNext));
  });
});

describe('getnext Success', () => {
  const action = {
    payload: {
      appGroupName: 'FEUW',
      isFirstVisit: true,
      dispositionCode: 'missingDocs',
    },
  };
  const saga = cloneableGenerator(TestExports.getNext)(action);
  const userDetails = {
    userDetails: {
      email: 'brent@mrcooper.com',
    },
    groupList: ['allaccess', 'cmod-dev-beta'],
  };

  const mockTaskDetails = {
    taskData: {
      data: {
        id: '1234',
        applicationId: '34567',
        wfProcessId: '34567',
        loanNumber: '12345',
      },
    },
  };
  it('should dispatch action SHOW_LOADER', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should dispatch action GetNext Loaded', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.GETNEXT_PROCESSED, payload: false }));
  });

  it('should get user group name', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.groupName));
  });

  it('should call save disposition generator', () => {
    expect(saga.next('FEUW').value)
      .toEqual(call(TestExports.saveGeneralChecklistDisposition, action.payload));
  });

  it('should get checklist comment', () => {
    const saveDispositionSuccess = true;
    expect(saga.next(saveDispositionSuccess).value)
      .toEqual(select(TestExports.checklistSelectors.getTaskComment));
  });

  it('should get checklist disposition comment', () => {
    expect(saga.next(mockComment).value)
      .toEqual(select(TestExports.checklistSelectors.getDispositionComment));
  });

  it('should get PUT disposition comment', () => {
    const testComment = 'test';
    expect(saga.next(testComment).value)
      .toEqual(put({ type: POST_COMMENT_SAGA, payload: testComment }));
  });

  it('should dispatch action RESET_DATA for checklist', () => {
    const saveDispositionSuccess = true;
    expect(saga.next(saveDispositionSuccess).value)
      .toEqual(put(resetChecklistData()));
  });

  it('should select userDetails from store', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call workassignment service to fetch taskDetails', () => {
    expect(saga.next(userDetails).value)
      .toEqual(call(Api.callGet, 'api/workassign/getNext?appGroupName=FEUW&userPrincipalName=brent@mrcooper.com&userGroups=allaccess,cmod-dev-beta&taskName='));
  });
  it('should dispatch action GET_HISTORICAL_CHECKLIST_DATA for checklist', () => {
    const taskid = {
      taskId: '1234',
    };
    expect(saga.next(mockTaskDetails).value)
      .toEqual(put({
        type: GET_HISTORICAL_CHECKLIST_DATA,
        payload: taskid,
      }));
  });
  it('should YIELD PUT ALL Comments', () => {
    expect(saga.next(mockTaskDetails).value)
      .toEqual(all([put({
        type: POST_COMMENT_SAGA,
        payload: mockComment.MISC_TSK_CHK2,
      })]));
  });

  it('should call fetchChecklistDetails generator to handle get next logic for checklist', () => {
    const expectedPayload = {
      appGroupName: 'FEUW',
      dispositionCode: 'missingDocs',
      isFirstVisit: true,
    };
    expect(saga.next(mockTaskDetails).value)
      .toEqual(call(TestExports.fetchChecklistDetailsForGetNext, mockTaskDetails, expectedPayload));
  });

  it('should save evalId and loanNumber and taskId from taskDetails Response', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.SAVE_EVALID_LOANNUMBER,
        payload: {
          loanNumber: '12345', evalId: '34567', taskId: '1234', piid: '34567',
        },
      }));
  });

  it('should dispatch action SAVE_TASKID', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SAVE_TASKID, payload: null }));
  });

  it('getnext worker should trigger fetchtombstone action', () => {
    const actionDispatched = {
      payload: {
        loanNumber: '12345',
        taskId: '1234',
      },
      type: 'app/tombstone/FETCH_TOMBSTONE_DATA',
    };
    expect(saga.next().value)
      .toEqual(put(actionDispatched));
  });

  it('getnext worker should trigger loadComments action', () => {
    const actionDispatched = {
      payload: {
        applicationName: 'CMOD',
        loanNumber: '12345',
        processId: '34567',
        processIdType: 'WF_PRCS_ID',
        evalId: '34567',
        taskId: '1234',
      },
      type: 'app/comments/GET_COMMENTS_SAGA',
    };
    expect(saga.next().value)
      .toEqual(put(actionDispatched));
  });

  it('should dispatch action HIDE_LOADER', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

describe('getnext Failure -  no tasks found', () => {
  const action = {
    payload: {
      appGroupName: 'FEUW',
      isFirstVisit: true,
      dispositionCode: 'missingDocs',
    },
  };
  const saga = cloneableGenerator(TestExports.getNext)(action);
  const userDetails = {
    userDetails: {
      email: 'brent@mrcooper.com',
    },
    groupList: ['allaccess', 'cmod-dev-beta'],
  };

  const mockTaskDetails = {
    messsage: 'No Tasks Found',
  };
  it('should dispatch action SHOW_LOADER', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should dispatch action GetNext Loaded', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.GETNEXT_PROCESSED, payload: false }));
  });

  it('should get user group name', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.groupName));
  });

  it('should call save disposition generator', () => {
    expect(saga.next('FEUW').value)
      .toEqual(call(TestExports.saveGeneralChecklistDisposition, action.payload));
  });

  it('should get checklist comment', () => {
    const saveChecklistDisposition = true;
    expect(saga.next(saveChecklistDisposition).value)
      .toEqual(select(TestExports.checklistSelectors.getTaskComment));
  });

  it('should get checklist disposition comment', () => {
    expect(saga.next(mockComment).value)
      .toEqual(select(TestExports.checklistSelectors.getDispositionComment));
  });

  it('should get PUT disposition comment', () => {
    const testComment = 'test';
    expect(saga.next(testComment).value)
      .toEqual(put({ type: POST_COMMENT_SAGA, payload: testComment }));
  });

  it('should dispatch action RESET_DATA for checklist', () => {
    expect(saga.next().value)
      .toEqual(put(resetChecklistData()));
  });

  it('should select userDetails from store', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call workassignment service to fetch taskDetails', () => {
    expect(saga.next(userDetails).value)
      .toEqual(call(Api.callGet, 'api/workassign/getNext?appGroupName=FEUW&userPrincipalName=brent@mrcooper.com&userGroups=allaccess,cmod-dev-beta&taskName='));
  });
  it('should dispatch action GET_HISTORICAL_CHECKLIST_DATA for checklist', () => {
    const taskid = {
      taskId: null,
    };
    expect(saga.next(mockTaskDetails).value)
      .toEqual(put({
        type: GET_HISTORICAL_CHECKLIST_DATA,
        payload: taskid,
      }));
  });

  it('should YIELD PUT ALL Comments', () => {
    expect(saga.next(mockTaskDetails).value)
      .toEqual(all([put({
        type: POST_COMMENT_SAGA,
        payload: mockComment.MISC_TSK_CHK2,
      })]));
  });

  it('should dispatch NO_TASKS_FOUND', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.TASKS_NOT_FOUND,
        payload: { noTasksFound: true },
      }));
  });
  it('should dispatch ERROR_LOADING_TOMBSTONE_DATA', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: ERROR_LOADING_TOMBSTONE_DATA,
        payload: { data: [], error: true, loading: false },
      }));
  });

  it('should call error handler for checklist', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.errorFetchingChecklistDetails));
  });

  it('should dispatch action HIDE_LOADER', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

describe('getnext Failure -  task fetch failure', () => {
  const action = {
    payload: {
      appGroupName: 'FEUW',
      isFirstVisit: true,
      dispositionCode: 'missingDocs',
    },
  };
  const saga = cloneableGenerator(TestExports.getNext)(action);
  const userDetails = {
    userDetails: {
      email: 'brent@mrcooper.com',
    },
    groupList: ['allaccess', 'cmod-dev-beta'],
  };

  const mockTaskDetails = null;
  it('should dispatch action SHOW_LOADER', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should dispatch action GetNext Loaded', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.GETNEXT_PROCESSED, payload: false }));
  });

  it('should get user group name', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.groupName));
  });

  it('should call save disposition generator', () => {
    expect(saga.next('FEUW').value)
      .toEqual(call(TestExports.saveGeneralChecklistDisposition, action.payload));
  });

  it('should get checklist comment', () => {
    const saveChecklistDisposition = true;
    expect(saga.next(saveChecklistDisposition).value)
      .toEqual(select(TestExports.checklistSelectors.getTaskComment));
  });

  it('should get checklist disposition comment', () => {
    expect(saga.next(mockComment).value)
      .toEqual(select(TestExports.checklistSelectors.getDispositionComment));
  });

  it('should get PUT disposition comment', () => {
    const testComment = 'test';
    expect(saga.next(testComment).value)
      .toEqual(put({ type: POST_COMMENT_SAGA, payload: testComment }));
  });

  it('should dispatch action RESET_DATA for checklist', () => {
    expect(saga.next().value)
      .toEqual(put(resetChecklistData()));
  });

  it('should select userDetails from store', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call workassignment service to fetch taskDetails', () => {
    expect(saga.next(userDetails).value)
      .toEqual(call(Api.callGet, 'api/workassign/getNext?appGroupName=FEUW&userPrincipalName=brent@mrcooper.com&userGroups=allaccess,cmod-dev-beta&taskName='));
  });
  it('should dispatch action GET_HISTORICAL_CHECKLIST_DATA for checklist', () => {
    const taskid = {
      taskId: null,
    };
    expect(saga.next(mockTaskDetails).value)
      .toEqual(put({
        type: GET_HISTORICAL_CHECKLIST_DATA,
        payload: taskid,
      }));
  });
  it('should YIELD PUT ALL Comments', () => {
    expect(saga.next(mockTaskDetails).value)
      .toEqual(all([put({
        type: POST_COMMENT_SAGA,
        payload: mockComment.MISC_TSK_CHK2,
      })]));
  });

  it('should dispatch TASK_FETCH_ERROR', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.TASKS_FETCH_ERROR,
        payload: { taskfetchError: true },
      }));
  });
  it('should dispatch ERROR_LOADING_TOMBSTONE_DATA', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: ERROR_LOADING_TOMBSTONE_DATA,
        payload: { data: [], error: true, loading: false },
      }));
  });

  it('should call error handler for checklist', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.errorFetchingChecklistDetails));
  });

  it('should dispatch action HIDE_LOADER', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

describe('watch expandView ', () => {
  it('should trigger setexpandview worker', () => {
    const saga = cloneableGenerator(TestExports.watchSetExpandView)();
    expect(saga.next().value)
      .toEqual(take(actionTypes.SET_EXPAND_VIEW_SAGA));
    expect(saga.next().value)
      .toEqual(fork(TestExports.setExpandView));
  });
});

describe('watch dispositionsave ', () => {
  it('should trigger savedisposition worker', () => {
    const saga = cloneableGenerator(TestExports.watchDispositionSave)();
    expect(saga.next().value)
      .toEqual(take(actionTypes.SAVE_DISPOSITION_SAGA, TestExports.saveDisposition));
    expect(saga.next('missingDocuments').value)
      .toEqual(fork(TestExports.saveDisposition, 'missingDocuments'));
  });
});

describe('watch endShift ', () => {
  it('should trigger endShift worker', () => {
    const saga = cloneableGenerator(TestExports.watchEndShift)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.END_SHIFT, TestExports.endShift));
  });
});

describe('endShift worker', () => {
  const action = {
    payload: {
      appGroupName: 'FEUW',
      isFirstVisit: true,
      dispositionCode: 'missingDocs',
    },
  };
  const saga = cloneableGenerator(TestExports.endShift)();
  it('should select groupName', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.groupName));
  });

  it('should dispatch app/dasboard/SHOW_LOADER', () => {
    expect(saga.next('FEUW').value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should select isFirstVisit', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.isFirstVisit));
  });

  it('should select DispositionCode', () => {
    expect(saga.next(true).value)
      .toEqual(select(checklistSelectors.getDispositionCode));
  });

  it('should make checklistDisposition call', () => {
    expect(saga.next('missingDocs').value)
      .toEqual(call(TestExports.saveGeneralChecklistDisposition, action.payload));
  });

  it('should get checklist disposition comment', () => {
    expect(saga.next(mockComment).value)
      .toEqual(select(TestExports.checklistSelectors.getDispositionComment));
  });

  it('should get PUT disposition comment', () => {
    const testComment = 'test';
    expect(saga.next(testComment).value)
      .toEqual(put({ type: POST_COMMENT_SAGA, payload: testComment }));
  });
  it('should reset checklist data', () => {
    expect(saga.next(true).value)
      .toEqual(put(resetChecklistData()));
  });

  it('should hide loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });

  it('should dispatch SUCCESS_END_SHIFT', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SUCCESS_END_SHIFT }));
  });
});

describe('expand view ', () => {
  it('should trigger the SET_EXPAND action', () => {
    const response = onExpandView(actionTypes.SET_EXPAND_VIEW_SAGA);
    expect(response.type).toEqual(actionTypes.SET_EXPAND_VIEW_SAGA);
  });

  describe('saveDisposition ', () => {
    it('should trigger the SAVE_DISPOSITION_SAGA action', () => {
      const response = dispositionSave(actionTypes.SAVE_DISPOSITION_SAGA);
      expect(response.type).toEqual(actionTypes.SAVE_DISPOSITION_SAGA);
    });
  });

  describe('clearDisposition ', () => {
    it('should trigger the SET_EXPAND action', () => {
      const response = clearDisposition();
      expect(response.type).toEqual(actionTypes.CLEAR_DISPOSITION);
    });
  });

  describe('clearFirstVisit ', () => {
    it('should trigger the SET_EXPAND action', () => {
      const response = clearFirstVisit();
      expect(response.type).toEqual(actionTypes.CLEAR_FIRST_VISIT);
    });
  });

  describe('saveDisposition saga ', () => {
    const dispositionPayload = {
      payload: {
        dispositionReason: 'missingDocs',
        group: 'FEUW',
      },
    };
    const mockResponse = {
      enableGetNext: true,
    };
    const mockUser = {
      userDetails: {
        email: 'bren@mrcooper.com',
      },
    };
    const saga = cloneableGenerator(TestExports.saveDisposition)(dispositionPayload);

    it('should call SHOW_SAVING_LOADER', () => {
      expect(saga.next().value)
        .toEqual(put({ type: actionTypes.SHOW_SAVING_LOADER }));
    });

    it('should call select evalId from store', () => {
      expect(saga.next().value)
        .toEqual(select(selectors.evalId));
    });

    it('should call select user from store', () => {
      expect(saga.next(1883281).value)
        .toEqual(select(loginSelectors.getUser));
    });

    it('should call select taskid from store', () => {
      expect(saga.next(mockUser).value)
        .toEqual(select(selectors.taskId));
    });

    it('should call validation service', () => {
      expect(saga.next(1161415).value)
        .toEqual(call(Api.callPost, '/api/disposition/disposition?evalCaseId=1883281&disposition=missingDocs&assignedTo=bren@mrcooper.com&taskId=1161415&group=FEUW', {}));
    });

    it('should update getNextResponse state', () => {
      expect(saga.next(mockResponse).value)
        .toEqual(put({
          type: actionTypes.SAVE_DISPOSITION,
          payload: mockResponse,
        }));
    });
    it('should call HIDE_SAVING_LOADER', () => {
      expect(saga.throw(new Error('disposition fetch failed')).value)
        .toEqual(put({ type: actionTypes.HIDE_SAVING_LOADER }));
    });
  });

  describe('saveDisposition saga ', () => {
    const dispositionPayload = {
      payload: {
        dispositionReason: 'missingDocs',
        group: 'FEUW',
      },
    };
    const mockUser = {
      userDetails: {
        email: 'bren@mrcooper.com',
      },
    };
    const saga = cloneableGenerator(TestExports.saveDisposition)(dispositionPayload);

    it('should call SHOW_SAVING_LOADER', () => {
      expect(saga.next().value)
        .toEqual(put({ type: actionTypes.SHOW_SAVING_LOADER }));
    });

    it('should call select evalId from store', () => {
      expect(saga.next().value)
        .toEqual(select(selectors.evalId));
    });

    it('should call select user from store', () => {
      expect(saga.next(1883281).value)
        .toEqual(select(loginSelectors.getUser));
    });

    it('should call select taskid from store', () => {
      expect(saga.next(mockUser).value)
        .toEqual(select(selectors.taskId));
    });

    it('should call validation service', () => {
      expect(saga.next(1161415).value)
        .toEqual(call(Api.callPost, '/api/disposition/disposition?evalCaseId=1883281&disposition=missingDocs&assignedTo=bren@mrcooper.com&taskId=1161415&group=FEUW', {}));
    });

    it('should call HIDE_SAVING_LOADER', () => {
      expect(saga.throw(new Error('disposition fetch failed')).value)
        .toEqual(put({ type: actionTypes.HIDE_SAVING_LOADER }));
    });
  });
});

describe('watch search Loan ', () => {
  it('should trigger searchLoan worker', () => {
    const saga = cloneableGenerator(TestExports.watchSearchLoan)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.SEARCH_LOAN_TRIGGER, TestExports.searchLoan));
  });
});


describe('search Loan Failure - Invalid Loan Number', () => {
  const mockResponse = {
    loanNumber: 18008401081,
    unAssigned: null,
    assigned: null,
    valid: false,
  };

  const loanNumber = {
    payload: '18008401081',
  };

  const saga = cloneableGenerator(TestExports.searchLoan)(loanNumber);

  it('should call select wasSearched from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.wasSearched));
  });

  it('should call select inProgress from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.inProgress));
  });

  it('should put SHOW_LOADER', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call search Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callGet, '/api/dataaggregator/search/loan/18008401081', {}));
  });

  it('should call SEARCH_LOAN_RESULT', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SEARCH_LOAN_RESULT, payload: { ...mockResponse } }));
  });
});

describe('search Loan Failure - No Eval cases', () => {
  const mockResponse = {
    loanNumber: 18008401081,
    unAssigned: null,
    assigned: null,
    valid: true,
  };

  const loanNumber = {
    payload: '18008401081',
  };

  const saga = cloneableGenerator(TestExports.searchLoan)(loanNumber);

  it('should call search Api', () => {
    saga.next();
    saga.next();
    saga.next();
    expect(saga.next().value)
      .toEqual(call(Api.callGet, '/api/dataaggregator/search/loan/18008401081', {}));
  });

  it('should call SEARCH_LOAN_RESULT', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SEARCH_LOAN_RESULT, payload: { ...mockResponse } }));
  });
});

describe('search Loan Success', () => {
  const mockResponse = {
    loanNumber: 18008401081,
    unAssigned: null,
    assigned: [
      {
        evalId: 1889000,
        taskId: 2323243,
        piid: 35345345,
        status: '',
        statusDate: '01-22-2019',
        taskName: 'FrontEnd Review',
        assignee: 'bren@mrcooper.com',
      }],
    valid: true,
  };

  const loanNumber = {
    payload: '18008401081',
  };

  const saga = cloneableGenerator(TestExports.searchLoan)(loanNumber);

  it('should call search Api', () => {
    saga.next();
    saga.next();
    saga.next();
    expect(saga.next().value)
      .toEqual(call(Api.callGet, '/api/dataaggregator/search/loan/18008401081', {}));
  });

  it('should call SEARCH_LOAN_RESULT', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SEARCH_LOAN_RESULT, payload: { ...mockResponse } }));
  });
});

describe('watch unassign Loan ', () => {
  it('should trigger unassignLoan worker', () => {
    const saga = cloneableGenerator(TestExports.watchUnassignLoan)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.UNASSIGN_LOAN, TestExports.unassignLoan));
  });
});

describe('unassign Loan', () => {
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
  };

  const mockResponse = {
    cmodProcess: {
      taskStatus: 'Paused',
    },
  };

  const saga = cloneableGenerator(TestExports.unassignLoan)();

  it('should call select evalId from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.evalId));
  });

  it('should call select userDetails from store', () => {
    expect(saga.next(3565247).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call select taskId from store', () => {
    expect(saga.next(mockUser).value)
      .toEqual(select(selectors.taskId));
  });

  it('should call select ProcessId from store', () => {
    expect(saga.next(74365847).value)
      .toEqual(select(selectors.processId));
  });

  it('should call select Process Status from store', () => {
    expect(saga.next(23456).value)
      .toEqual(select(selectors.processStatus));
  });

  it('should call select loanNumber from store', () => {
    expect(saga.next('Active').value)
      .toEqual(select(selectors.loanNumber));
  });

  it('should call select groupName from store', () => {
    expect(saga.next(18008401081).value)
      .toEqual(select(selectors.groupName));
  });

  it('should call unassign Api', () => {
    expect(saga.next('DIB').value)
      .toEqual(call(Api.callPost, '/api/workassign/unassignLoan?evalId=3565247&assignedTo=bren@mrcooper.com&loanNumber=18008401081&taskId=74365847&processId=23456&processStatus=Active&appgroupName=DIB&taskName=', {}));
  });

  it('should call UNASSIGN_LOAN_RESULT', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.UNASSIGN_LOAN_RESULT, payload: { ...mockResponse } }));
  });
});

describe('watch assign Loan ', () => {
  it('should trigger assignLoan worker', () => {
    const saga = cloneableGenerator(TestExports.watchAssignLoan)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.ASSIGN_LOAN, TestExports.assignLoan));
  });
});

describe('watch sendToFEUW ', () => {
  it('should trigger sendToFEUW worker', () => {
    const saga = cloneableGenerator(TestExports.watchSendToFEUW)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.SEND_TO_FEUW_SAGA, TestExports.sendToFEUW));
  });
});

describe('send to FEUW : success', () => {
  const action = {
    payload: {
      processId: '1234',
      evalId: '6567',
    },
    type: 'app/dashboard/SEND_TO_FEUW_SAGA',
  };

  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
  };

  const mockRequest = {
    processId: '1234',
    evalId: '6567',
    userPrincipalName: 'bren@mrcooper.com',
  };

  const mockResponse = {
    status: '200',
    message: 'Sent to FEUW successfully',
  };

  const saga = cloneableGenerator(TestExports.sendToFEUW)(action);

  it('should call select userDetails from store', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should dispatch action SHOW_LOADER', () => {
    expect(saga.next(mockUser).value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call sendToFEUW Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, '/api/workassign/sendToFEUW', mockRequest));
  });

  it('should dispatch action SET_RESULT_OPERATION', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SET_RESULT_OPERATION, payload: { level: LEVEL_SUCCESS, status: 'Sent to FEUW successfully' } }));
  });

  it('should dispatch action DISABLE_SEND_TO_FEUW', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.DISABLE_SEND_TO_FEUW }));
  });
});

describe('send to FEUW : failure', () => {
  const action = {
    payload: {
      processId: '1234',
      evalId: '6567',
    },
    type: 'app/dashboard/SEND_TO_FEUW_SAGA',
  };

  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
  };

  const mockRequest = {
    processId: '1234',
    evalId: '6567',
    userPrincipalName: 'bren@mrcooper.com',
  };

  const mockResponse = {
    status: '402',
    message: 'Invalid Event',
  };

  const saga = cloneableGenerator(TestExports.sendToFEUW)(action);

  it('should call select userDetails from store', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should dispatch action SHOW_LOADER', () => {
    expect(saga.next(mockUser).value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call sendToFEUW Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, '/api/workassign/sendToFEUW', mockRequest));
  });

  it('should dispatch action SET_RESULT_OPERATION', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SET_RESULT_OPERATION, payload: { level: LEVEL_FAILED, status: 'Invalid Event' } }));
  });
});

describe('send to FEUW : error', () => {
  const action = {
    payload: {
      processId: '1234',
      evalId: '6567',
    },
    type: 'app/dashboard/SEND_TO_FEUW_SAGA',
  };

  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
  };

  const mockRequest = {
    processId: '1234',
    evalId: '6567',
    userPrincipalName: 'bren@mrcooper.com',
  };

  const saga = cloneableGenerator(TestExports.sendToFEUW)(action);

  it('should call select userDetails from store', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should dispatch action SHOW_LOADER', () => {
    expect(saga.next(mockUser).value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call sendToFEUW Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, '/api/workassign/sendToFEUW', mockRequest));
  });

  it('should dispatch action SET_RESULT_OPERATION', () => {
    expect(saga.next(null).value)
      .toEqual(put({
        type: actionTypes.SET_RESULT_OPERATION,
        payload: { level: LEVEL_ERROR, status: MSG_SERVICE_DOWN },
      }));
  });
});

describe('send to FEUW : 500 error', () => {
  const action = {
    payload: {
      processId: '1234',
      evalId: '6567',
    },
    type: 'app/dashboard/SEND_TO_FEUW_SAGA',
  };

  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
  };

  const mockRequest = {
    processId: '1234',
    evalId: '6567',
    userPrincipalName: 'bren@mrcooper.com',
  };

  const mockResponse = {
    status: '500',
    message: 'The workflow could not move forward at this time',
  };

  const saga = cloneableGenerator(TestExports.sendToFEUW)(action);

  it('should call select userDetails from store', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should dispatch action SHOW_LOADER', () => {
    expect(saga.next(mockUser).value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call sendToFEUW Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, '/api/workassign/sendToFEUW', mockRequest));
  });

  it('should dispatch action SET_RESULT_OPERATION', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({
        type: actionTypes.SET_RESULT_OPERATION,
        payload: { level: LEVEL_FAILED, status: MSG_SERVICE_DOWN },
      }));
  });
});

describe('assign Loan', () => {
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
    groupList: ['feuw', 'beta'],
  };

  const mockResponse = {
    cmodProcess: {
      evalId: 3565247,
      taskId: 74365847,
    },
    status: 'Loan Assignment Successful',
  };

  const saga = cloneableGenerator(TestExports.assignLoan)();

  it('should call select evalId from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.evalId));
  });

  it('should call select userDetails from store', () => {
    expect(saga.next(3565247).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call select taskId from store', () => {
    expect(saga.next(mockUser).value)
      .toEqual(select(selectors.taskId));
  });

  it('should call select groupName from store', () => {
    expect(saga.next(74365847).value)
      .toEqual(select(selectors.groupName));
  });

  it('should call select ProcessId from store', () => {
    expect(saga.next('FEUW').value)
      .toEqual(select(selectors.processId));
  });

  it('should call select Process Status from store', () => {
    expect(saga.next(23456).value)
      .toEqual(select(selectors.processStatus));
  });

  it('should call select loanNumber from store', () => {
    expect(saga.next('Active').value)
      .toEqual(select(selectors.loanNumber));
  });
  it('should call assign Api', () => {
    expect(saga.next(18008401081).value)
      .toEqual(call(Api.callPost, '/api/workassign/assignLoan?evalId=3565247&assignedTo=bren@mrcooper.com&loanNumber=18008401081&taskId=74365847&processId=23456&processStatus=Active&groupName=FEUW&userGroups=feuw,beta&taskName=', {}));
  });
  it('should dispatch action GET_HISTORICAL_CHECKLIST_DATA for checklist', () => {
    const taskid = {
      taskId: 74365847,
    };
    expect(saga.next(mockResponse).value)
      .toEqual(put({
        type: GET_HISTORICAL_CHECKLIST_DATA,
        payload: taskid,
      }));
  });
  it('should call ASSIGN_LOAN_RESULT', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.ASSIGN_LOAN_RESULT, payload: { ...mockResponse } }));
  });
});


describe('Parse the Excel file to JSON for covius data input', () => {
  const action = {
    payload: [
      { caseId: 34, message: 'mock1' },
      { caseId: 33, message: 'mock2' },
    ],
    type: 'app/dashboard/PROCESS_FILE',
  };

  const mockFile = [
    { caseId: 34, message: 'mock1' },
    { caseId: 33, message: 'mock2' },
  ];
  const saga = cloneableGenerator(TestExports.onUploadingFile)(action);
  it('should call processExcel function', () => {
    expect(saga.next().value)
      .toEqual((call(TestExports.processExcel, mockFile)));
  });

  it('should store the parsed excel file', () => {
    expect(saga.next(mockFile).value)
      .toEqual(put({ type: actionTypes.SAVE_PROCESSED_FILE, payload: mockFile }));
  });
});

describe('watch submitFile ', () => {
  it('should trigger submit file worker', () => {
    const saga = cloneableGenerator(TestExports.watchOnSubmitFile)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.SUBMIT_FILE, TestExports.onFileSubmit));
  });
});

describe('submit file to covius : Success', () => {
  const mockFile = [
    { EventCode: 'mockCode', caseId: 34, message: 'mock1' },
    { caseId: 33, message: 'mock2' },
  ];
  const mockResponse = {
    message: 'File submitted to Covius successfully',
    level: LEVEL_SUCCESS,
  };
  const saga = cloneableGenerator(TestExports.onFileSubmit)();
  it('should call select uploaded file from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getUploadedFile));
  });

  it('should call sendToCovius saga', () => {
    expect(saga.next(JSON.stringify(mockFile)).value)
      .toEqual(call(TestExports.sendToCovius, true, mockFile));
  });

  it('should call SET_COVIUS_DATA', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SET_COVIUS_DATA, payload: mockResponse }));
  });
  it('should call SET_RESULT_OPERATION', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SET_RESULT_OPERATION, payload: { status: 'File submitted to Covius successfully', level: LEVEL_SUCCESS } }));
  });
});

describe('submit file to covius : Upload Failed', () => {
  const mockFile = [
    { EventCode: 'mockCode', caseId: 34, message: 'mock1' },
    { caseId: 33, message: 'mock2' },
  ];
  const mockResponse = {
    uploadFailed: [
      {
        caseId: '354654',
        message: "CaseId doesn't exist",
      },
      {
        caseId: '545656',
        message: 'Case is not Active',
      },
    ],
    message: 'One or more case Ids have failed validation',
    level: LEVEL_FAILED,
  };
  const saga = cloneableGenerator(TestExports.onFileSubmit)();
  it('should call select uploaded file from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getUploadedFile));
  });

  it('should call sendToCovius saga', () => {
    expect(saga.next(JSON.stringify(mockFile)).value)
      .toEqual(call(TestExports.sendToCovius, true, mockFile));
  });

  it('should call SET_COVIUS_DATA', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SET_COVIUS_DATA, payload: mockResponse }));
  });
  it('should call SET_RESULT_OPERATION', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SET_RESULT_OPERATION, payload: { status: 'One or more case Ids have failed validation', level: LEVEL_FAILED } }));
  });
});

describe('submit file to covius : Failure', () => {
  const mockFile = [
    { EventCode: 'mockCode', caseId: 34, message: 'mock1' },
    { caseId: 33, message: 'mock2' },
  ];

  const saga = cloneableGenerator(TestExports.onFileSubmit)();
  it('should call select uploaded file from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getUploadedFile));
  });

  it('should call sendToCovius saga', () => {
    expect(saga.next(JSON.stringify(mockFile)).value)
      .toEqual(call(TestExports.sendToCovius, true, mockFile));
  });
  it('should call SET_COVIUS_DATA', () => {
    expect(saga.next(null).value)
      .toEqual(put({ type: actionTypes.SET_COVIUS_DATA, payload: null }));
  });
});

describe('submit file to covius : Service down', () => {
  const action = {
    payload: 'X request',
  };
  const mockFile = [
    { caseId: 34, message: 'mock1' },
    { caseId: 33, message: 'mock2' },
  ];
  const saga = cloneableGenerator(TestExports.onFileSubmit)(action);
  it('should call select uploaded file from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getUploadedFile));
  });
  it('should call SET_RESULT_OPERATION', () => {
    expect(saga.next(mockFile).value)
      .toEqual(put({
        type: actionTypes.SET_RESULT_OPERATION,
        payload: { status: MSG_SERVICE_DOWN, level: LEVEL_FAILED },
      }));
  });
});

describe('watch downloadFile ', () => {
  it('should trigger download file worker', () => {
    const saga = cloneableGenerator(TestExports.watchOnDownloadFile)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.DOWNLOAD_FILE, TestExports.onDownloadFile));
  });
});

describe('onDownloadFile Success case', () => {
  const action = {
    payload: {
      fileName: 'mock filename',
      data: [
        {
          caseId: '123',
          reason: "CaseId doesn't exist",
        },
      ],
    },
  };
  const mockPayload = {
    status: 'Excel File Downloaded Successfully',
    level: LEVEL_SUCCESS,
  };
  const saga = cloneableGenerator(TestExports.onDownloadFile)(action);
  it('should call SET_RESULT_OPERATION', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SET_RESULT_OPERATION, payload: mockPayload }));
  });
});

describe('onDownloadFile Failed case', () => {
  const action = {
    payload: {
    },
  };
  const mockPayload = {
    status: 'The conversion to excel has failed. Please reach out to the CMOD Support team to troubleshoot.',
    level: 'Failed',
  };
  const saga = cloneableGenerator(TestExports.onDownloadFile)(action);
  it('should call SET_RESULT_OPERATION', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SET_RESULT_OPERATION, payload: mockPayload }));
  });
});

describe('watch uploadFile ', () => {
  it('should trigger upload file worker', () => {
    const saga = cloneableGenerator(TestExports.watchOnUploadFile)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.PROCESS_FILE, TestExports.onUploadingFile));
  });
});

describe('onUploadingfile', () => {
  const action = {
    payload: {
      mockFile: 'mock file data',
    },
  };
  const mockData = 'mock data';
  const saga = cloneableGenerator(TestExports.onUploadingFile)(action);
  it('should call processExcel', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.processExcel, action.payload));
  });
  it('should call SAVE_PROCESSED_FILE', () => {
    expect(saga.next(mockData).value)
      .toEqual(put({ type: actionTypes.SAVE_PROCESSED_FILE, payload: mockData }));
  });
  it('should call SET_RESULT_OPERATION', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.SET_RESULT_OPERATION,
        payload: {
          status: 'Excel file uploaded successfully',
          level: 'Success',
        },
      }));
  });
});

describe('submit file to covius (FulfillmentRequest) : Success', () => {
  const mockFile = [
    { caseId: 34, message: 'mock1' },
    { caseId: 33, message: 'mock2' },
  ];

  const mockResponse = {
    message: 'File submitted to Covius successfully',
    level: LEVEL_SUCCESS,
  };

  const mockFileUploadResponse = {};
  mockFileUploadResponse.message = 'The request was successfully sent to Covius';
  mockFileUploadResponse.level = 'Success';
  const saga = cloneableGenerator(TestExports.onFileSubmit)();
  it('should call select uploaded file from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getUploadedFile));
  });

  it('should call sendToCovius saga', () => {
    expect(saga.next(JSON.stringify(mockFile)).value)
      .toEqual(call(TestExports.sendToCovius, false, mockFile));
  });

  it('should call SET_COVIUS_DATA', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SET_COVIUS_DATA, payload: mockResponse }));
  });
  it('should call SET_RESULT_OPERATION', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SET_RESULT_OPERATION, payload: { status: 'File submitted to Covius successfully', level: LEVEL_SUCCESS } }));
  });
});

describe('watch populateDropdown', () => {
  it('should trigger populate dropdown', () => {
    const saga = cloneableGenerator(TestExports.watchPopulateEventsDropDown)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.POPULATE_EVENTS_DROPDOWN, TestExports.populateDropdown));
  });
});

describe('populateDropdown saga ', () => {
  const saga = cloneableGenerator(TestExports.populateDropdown)();
  const mockResponse = [
    {
      eventCode: 'abc',
      eventCategor: 'def',
    },
  ];
  it('should call populate event service', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callGet, '/api/dataservice/api/covius/eventCategoriesAndTypes/Outgoing'));
  });
  it('should call SAVE_EVENTS_DROPDOWN', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.SAVE_EVENTS_DROPDOWN, payload: mockResponse }));
  });
});

describe('watch onCoviusBulkUpload', () => {
  it('should trigger covius bulk order', () => {
    const saga = cloneableGenerator(TestExports.watchCoviusBulkOrder)();
    expect(saga.next().value)
      .toEqual(takeEvery(actionTypes.PROCESS_COVIUS_BULK, TestExports.onCoviusBulkUpload));
  });
});

describe('onCoviusBulkUpload saga ', () => {
  const payload = {
    payload: {
      caseIds: ['12', '52', '32'],
    },
  };
  const saga = cloneableGenerator(TestExports.onCoviusBulkUpload)(payload);

  it('should call select user from store', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });
});

describe('handle widget : Loan Assignment Successful', () => {
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
    groupList: ['feuw', 'beta'],
  };

  const mockResponse = {
    taskData: {
      evalId: 3565247,
      taskId: 74365847,
      loanNumber: 18008401081,
      wfProcessId: 23456,
      processStatus: 'Active',
      groupName: 'BOOKING',
    },
    status: 'Loan Assignment Successful',
    statusCode: {},
  };

  const mockEvalDetails = {
    evalId: 3565247,
    loanNumber: 18008401081,
    taskId: 74365847,
    processId: 23456,
    processStatus: 'Active',
    appgroupName: 'BOOKING',
  };

  const saga = cloneableGenerator(TestExports.handleWidget)();
  it('should call show loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call select evalId from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.evalId));
  });
  it('should call select loanNumber from store', () => {
    expect(saga.next(3565247).value)
      .toEqual(select(selectors.loanNumber));
  });
  it('should call select isAssigned from store', () => {
    expect(saga.next(18008401081).value)
      .toEqual(select(selectors.isAssigned));
  });

  it('should call select ProcessId from store', () => {
    expect(saga.next(true).value)
      .toEqual(select(selectors.processId));
  });

  it('should call select groupName from store', () => {
    expect(saga.next(23456).value)
      .toEqual(select(selectors.groupName));
  });

  it('should call select RootTaskId from store', () => {
    expect(saga.next('BOOKING').value)
      .toEqual(select(checklistSelectors.getRootTaskId));
  });

  it('should call select selectedChecklistId from store', () => {
    expect(saga.next(123).value)
      .toEqual(select(checklistSelectors.getProcessId));
  });

  it('should call select userDetails from store', () => {
    expect(saga.next(456).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call SAVE_MAIN_CHECKLIST', () => {
    expect(saga.next(mockUser).value)
      .toEqual(put({
        type: actionTypes.SAVE_MAIN_CHECKLIST,
        payload: { rootTaskId: 123, selectedChecklistId: 456 },
      }));
  });

  it('should call select Process Status from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.processStatus));
  });

  it('should call assign Api', () => {
    expect(saga.next('Active').value)
      .toEqual(call(Api.callPost, '/api/workassign/assignBookingLoan?evalId=3565247&assignedTo=bren@mrcooper.com&loanNumber=18008401081&processId=23456&processStatus=Active&groupName=BOOKING&userGroups=feuw,beta&taskName=Pending Booking', {}));
  });

  it('should call ASSIGN_LOAN_RESULT', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({ type: actionTypes.ASSIGN_LOAN_RESULT, payload: { ...mockResponse } }));
  });
  it('should call fetchChecklistDetailsForAssign ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fetchChecklistDetailsForAssign, 'BOOKING', mockResponse));
  });

  it('should call SAVE_EVAL_FOR_WIDGET', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SAVE_EVAL_FOR_WIDGET, payload: mockEvalDetails }));
  });
  it('should dispatch action GET_HISTORICAL_CHECKLIST_DATA for checklist', () => {
    const taskid = {
      taskId: '18008401081_3565247',
    };
    expect(saga.next().value)
      .toEqual(put({
        type: GET_HISTORICAL_CHECKLIST_DATA,
        payload: taskid,
      }));
  });
  it('should call getResolutionDataForEval ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.getResolutionDataForEval, 3565247));
  });
  it('should call hide loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

describe('handle widget : Loan Assignment unSuccessful', () => {
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
    groupList: ['feuw', 'beta'],
  };

  const mockResponse = {
    taskData: {
      evalId: 3565247,
      taskId: 74365847,
      loanNumber: 18008401081,
      wfProcessId: 23456,
      processStatus: 'Active',
      groupName: 'BOOKING',
    },
    status: 'Loan Assignment Unsuccessful',
    statusCode: {
      Warning: true,
    },
    bookingTaskId: 1234,
  };

  const mockEvalDetails = {
    evalId: 3565247,
    loanNumber: 18008401081,
    taskId: 74365847,
    processId: 23456,
    processStatus: 'Active',
    appgroupName: 'BOOKING',
  };

  const saga = cloneableGenerator(TestExports.handleWidget)();
  it('should call show loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call select evalId from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.evalId));
  });
  it('should call select loanNumber from store', () => {
    expect(saga.next(3565247).value)
      .toEqual(select(selectors.loanNumber));
  });
  it('should call select isAssigned from store', () => {
    expect(saga.next(18008401081).value)
      .toEqual(select(selectors.isAssigned));
  });

  it('should call select ProcessId from store', () => {
    expect(saga.next(true).value)
      .toEqual(select(selectors.processId));
  });

  it('should call select groupName from store', () => {
    expect(saga.next(23456).value)
      .toEqual(select(selectors.groupName));
  });

  it('should call select RootTaskId from store', () => {
    expect(saga.next('BOOKING').value)
      .toEqual(select(checklistSelectors.getRootTaskId));
  });

  it('should call select selectedChecklistId from store', () => {
    expect(saga.next(123).value)
      .toEqual(select(checklistSelectors.getProcessId));
  });

  it('should call select userDetails from store', () => {
    expect(saga.next(456).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call SAVE_MAIN_CHECKLIST', () => {
    expect(saga.next(mockUser).value)
      .toEqual(put({
        type: actionTypes.SAVE_MAIN_CHECKLIST,
        payload: { rootTaskId: 123, selectedChecklistId: 456 },
      }));
  });

  it('should call select Process Status from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.processStatus));
  });

  it('should call assign Api', () => {
    expect(saga.next('Active').value)
      .toEqual(call(Api.callPost, '/api/workassign/assignBookingLoan?evalId=3565247&assignedTo=bren@mrcooper.com&loanNumber=18008401081&processId=23456&processStatus=Active&groupName=BOOKING&userGroups=feuw,beta&taskName=Pending Booking', {}));
  });

  it('should call ASSIGN_LOAN_RESULT', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({
        type: actionTypes.ASSIGN_LOAN_RESULT,
        payload: { status: mockResponse.status },
      }));
  });

  it('should call SAVE_EVAL_FOR_WIDGET', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SAVE_EVAL_FOR_WIDGET, payload: mockEvalDetails }));
  });
  it('should dispatch action GET_HISTORICAL_CHECKLIST_DATA for checklist', () => {
    const taskid = {
      taskId: '18008401081_3565247',
    };
    expect(saga.next().value)
      .toEqual(put({
        type: GET_HISTORICAL_CHECKLIST_DATA,
        payload: taskid,
      }));
  });
  it('should call getResolutionDataForEval ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.getResolutionDataForEval, 3565247));
  });
  it('should call hide loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

describe('handle widget not assigned : checklist not found', () => {
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
    groupList: ['feuw', 'beta'],
  };

  const mockResponse = {
    taskData: {
      evalId: 3565247,
      taskId: 74365847,
      loanNumber: 18008401081,
      wfProcessId: 23456,
      processStatus: 'Active',
      groupName: 'BOOKING',
    },
    status: 'Loan Assignment Unsuccessful',
    statusCode: {
      Warning: true,
    },
    bookingTaskId: 1234,
  };

  const mockDataserviceResponse = {
    wfTaskId: 74365847,
    assignedTo: 'bren@mrcooper.com',
    taskStatus: 'Assigned',
    taskCheckListId: 123,
  };


  const mockEvalDetails = {
    evalId: 3565247,
    loanNumber: 18008401081,
    taskId: '18008401081_3565247',
    processId: 23456,
    taskStatus: 'Assigned',
    assignee: 'bren@mrcooper.com',
  };

  const saga = cloneableGenerator(TestExports.handleWidget)();
  it('should call show loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call select evalId from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.evalId));
  });
  it('should call select loanNumber from store', () => {
    expect(saga.next(3565247).value)
      .toEqual(select(selectors.loanNumber));
  });
  it('should call select isAssigned from store', () => {
    expect(saga.next(18008401081).value)
      .toEqual(select(selectors.isAssigned));
  });

  it('should call select ProcessId from store', () => {
    expect(saga.next(false).value)
      .toEqual(select(selectors.processId));
  });

  it('should call select groupName from store', () => {
    expect(saga.next(23456).value)
      .toEqual(select(selectors.groupName));
  });

  it('should call select RootTaskId from store', () => {
    expect(saga.next('BOOKING').value)
      .toEqual(select(checklistSelectors.getRootTaskId));
  });

  it('should call select selectedChecklistId from store', () => {
    expect(saga.next(123).value)
      .toEqual(select(checklistSelectors.getProcessId));
  });

  it('should call select userDetails from store', () => {
    expect(saga.next(456).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call SAVE_MAIN_CHECKLIST', () => {
    expect(saga.next(mockUser).value)
      .toEqual(put({
        type: actionTypes.SAVE_MAIN_CHECKLIST,
        payload: { rootTaskId: 123, selectedChecklistId: 456 },
      }));
  });
  it('should call dataservie Api to fetch task details', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callGet, '/api/dataservice/api/taskInfo/18008401081_3565247'));
  });
  it('should call resetChecklistData', () => {
    expect(saga.next(mockDataserviceResponse).value)
      .toEqual(put(TestExports.resetChecklistData()));
  });
  it('should call CLEAR_ERROR_MESSAGE', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.CLEAR_ERROR_MESSAGE,
        payload: { },
      }));
  });
  it('should call fetchChecklistDetails ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fetchChecklistDetails, 123));
  });
  it('should call SAVE_EVAL_FOR_WIDGET', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SAVE_EVAL_FOR_WIDGET, payload: mockEvalDetails }));
  });
  it('should dispatch action GET_HISTORICAL_CHECKLIST_DATA for checklist', () => {
    const taskid = {
      taskId: '18008401081_3565247',
    };
    expect(saga.next().value)
      .toEqual(put({
        type: GET_HISTORICAL_CHECKLIST_DATA,
        payload: taskid,
      }));
  });
  it('should call getResolutionDataForEval ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.getResolutionDataForEval, 3565247));
  });
  it('should call hide loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});
describe('handle widget not assigned : checklist found', () => {
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
    groupList: ['feuw', 'beta'],
  };

  const mockResponse = {
    taskData: {
      evalId: 3565247,
      taskId: 74365847,
      loanNumber: 18008401081,
      wfProcessId: 23456,
      processStatus: 'Active',
      groupName: 'BOOKING',
    },
    status: 'Loan Assignment Unsuccessful',
    statusCode: {
      Warning: true,
    },
    bookingTaskId: 1234,
  };

  const mockDataserviceResponse = {
    wfTaskId: 74365847,
    assignedTo: 'bren@mrcooper.com',
    taskStatus: 'Assigned',
  };

  const mockDataServicePayload = {
    taskId: '18008401081_3565247',
    taskName: 'Pending Booking',
    groupList: [
      'feuw',
      'beta',
    ],
    appGroupName: 'BOOKING',
  };


  const mockEvalDetails = {
    evalId: 3565247,
    loanNumber: 18008401081,
    taskId: '18008401081_3565247',
    processId: 23456,
    taskStatus: 'Assigned',
    assignee: 'bren@mrcooper.com',
  };

  const saga = cloneableGenerator(TestExports.handleWidget)();
  it('should call show loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call select evalId from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.evalId));
  });
  it('should call select loanNumber from store', () => {
    expect(saga.next(3565247).value)
      .toEqual(select(selectors.loanNumber));
  });
  it('should call select isAssigned from store', () => {
    expect(saga.next(18008401081).value)
      .toEqual(select(selectors.isAssigned));
  });

  it('should call select ProcessId from store', () => {
    expect(saga.next(false).value)
      .toEqual(select(selectors.processId));
  });

  it('should call select groupName from store', () => {
    expect(saga.next(23456).value)
      .toEqual(select(selectors.groupName));
  });

  it('should call select RootTaskId from store', () => {
    expect(saga.next('BOOKING').value)
      .toEqual(select(checklistSelectors.getRootTaskId));
  });

  it('should call select selectedChecklistId from store', () => {
    expect(saga.next(123).value)
      .toEqual(select(checklistSelectors.getProcessId));
  });

  it('should call select userDetails from store', () => {
    expect(saga.next(456).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call SAVE_MAIN_CHECKLIST', () => {
    expect(saga.next(mockUser).value)
      .toEqual(put({
        type: actionTypes.SAVE_MAIN_CHECKLIST,
        payload: { rootTaskId: 123, selectedChecklistId: 456 },
      }));
  });
  it('should call dataservie Api to fetch task details', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callGet, '/api/dataservice/api/taskInfo/18008401081_3565247'));
  });
  it('should call dataservie Api to fetch task details', () => {
    expect(saga.next(mockDataserviceResponse).value)
      .toEqual(call(Api.callPost, '/api/workassign/generateNewChecklist', mockDataServicePayload));
  });
  it('should call resetChecklistData', () => {
    expect(saga.next({ taskCheckListId: 123 }).value)
      .toEqual(put(TestExports.resetChecklistData()));
  });
  it('should call CLEAR_ERROR_MESSAGE', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.CLEAR_ERROR_MESSAGE,
        payload: { },
      }));
  });
  it('should call fetchChecklistDetails ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fetchChecklistDetails, 123));
  });
  it('should call SAVE_EVAL_FOR_WIDGET', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SAVE_EVAL_FOR_WIDGET, payload: mockEvalDetails }));
  });
  it('should dispatch action GET_HISTORICAL_CHECKLIST_DATA for checklist', () => {
    const taskid = {
      taskId: '18008401081_3565247',
    };
    expect(saga.next().value)
      .toEqual(put({
        type: GET_HISTORICAL_CHECKLIST_DATA,
        payload: taskid,
      }));
  });
  it('should call getResolutionDataForEval ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.getResolutionDataForEval, 3565247));
  });
  it('should call hide loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

describe('unassignWidgetLoan : unassignLoan successful', () => {
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
    groupList: ['feuw', 'beta'],
  };

  const mockResponse = {
    taskData: {
      evalId: 3565247,
      taskId: 74365847,
      loanNumber: 18008401081,
      wfProcessId: 23456,
      processStatus: 'Active',
      groupName: 'BOOKING',
    },
    status: 'Loan Assignment Unsuccessful',
    bookingTaskId: 1234,
  };

  const mockWidgetLoan = {
    evalId: 3565247,
    loanNumber: 18008401081,
    taskId: 74365847,
    processId: 23456,
    processStatus: 'Active',
    appgroupName: 'BOOKING',
  };

  const saga = cloneableGenerator(TestExports.unassignWidgetLoan)();
  it('should call show loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call select widget loan from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getWidgetLoan));
  });

  it('should call select userDetails from store', () => {
    expect(saga.next(mockWidgetLoan).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call assign Api', () => {
    expect(saga.next(mockUser).value)
      .toEqual(call(Api.callPost, '/api/workassign/unassignLoan?evalId=3565247&assignedTo=bren@mrcooper.com&loanNumber=18008401081&taskId=74365847&processId=23456&processStatus=Active&appgroupName=BOOKING&taskName=Pending Booking&isWidgetLoan=true', {}));
  });
  it('should call RESET_DATA', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({
        type: 'app/tasks-and-checklist/RESET_DATA',
      }));
  });

  it('should call UNASSIGN_LOAN_RESULT', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.UNASSIGN_LOAN_RESULT,
        payload: mockResponse,
      }));
  });
  it('should call select selectedChecklistId from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getSelectedChecklistId));
  });

  it('should call fetchChecklistDetails ', () => {
    expect(saga.next(123).value)
      .toEqual(call(TestExports.fetchChecklistDetails, 123));
  });

  it('should call hide loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

describe('unassignWidgetLoan : unassignLoan unsuccessful', () => {
  const mockUser = {
    userDetails: {
      email: 'bren@mrcooper.com',
    },
    groupList: ['feuw', 'beta'],
  };

  const mockResponse = null;

  const mockWidgetLoan = {
    evalId: 3565247,
    loanNumber: 18008401081,
    taskId: 74365847,
    processId: 23456,
    processStatus: 'Active',
    appgroupName: 'BOOKING',
  };

  const saga = cloneableGenerator(TestExports.unassignWidgetLoan)();
  it('should call show loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call select widget loan from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getWidgetLoan));
  });

  it('should call select userDetails from store', () => {
    expect(saga.next(mockWidgetLoan).value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should call assign Api', () => {
    expect(saga.next(mockUser).value)
      .toEqual(call(Api.callPost, '/api/workassign/unassignLoan?evalId=3565247&assignedTo=bren@mrcooper.com&loanNumber=18008401081&taskId=74365847&processId=23456&processStatus=Active&appgroupName=BOOKING&taskName=Pending Booking&isWidgetLoan=true', {}));
  });

  it('should call UNASSIGN_LOAN_RESULT', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(put({
        type: actionTypes.UNASSIGN_LOAN_RESULT,
        payload: { cmodProcess: { taskStatus: 'ERROR' } },
      }));
  });

  it('should call hide loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

describe('unassignWidgetLoan : Failed', () => {
  const mockWidgetLoan = {
    loanNumber: 18008401081,
    taskId: 74365847,
    processId: 23456,
    processStatus: 'Active',
    appgroupName: 'BOOKING',
  };

  const saga = cloneableGenerator(TestExports.unassignWidgetLoan)();
  it('should call show loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.SHOW_LOADER }));
  });

  it('should call select widget loan from store', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getWidgetLoan));
  });

  it('should call UNASSIGN_LOAN_RESULT', () => {
    expect(saga.next(mockWidgetLoan).value)
      .toEqual(put({
        type: actionTypes.UNASSIGN_LOAN_RESULT,
        payload: { cmodProcess: { taskStatus: 'ERROR' } },
      }));
  });

  it('should call hide loader', () => {
    expect(saga.next().value)
      .toEqual(put({ type: actionTypes.HIDE_LOADER }));
  });
});

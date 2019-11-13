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
      .toEqual(call(TestExports.fetchChecklistDetails, mockTaskDetails, expectedPayload));
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
  it('getnext worker should trigger fetchtombstone action', () => {
    const actionDispatched = {
      payload: {
        loanNumber: '12345',
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
      .toEqual(call(Api.callGet, '/api/search-svc/search/loan/18008401081', {}));
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
      .toEqual(call(Api.callGet, '/api/search-svc/search/loan/18008401081', {}));
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
      .toEqual(call(Api.callGet, '/api/search-svc/search/loan/18008401081', {}));
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

  it('should call unassign Api', () => {
    expect(saga.next(18008401081).value)
      .toEqual(call(Api.callPost, '/api/workassign/unassignLoan?evalId=3565247&assignedTo=bren@mrcooper.com&loanNumber=18008401081&taskId=74365847&processId=23456&processStatus=Active', {}));
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
      .toEqual(call(Api.callPost, '/api/workassign/assignLoan?evalId=3565247&assignedTo=bren@mrcooper.com&loanNumber=18008401081&taskId=74365847&processId=23456&processStatus=Active&groupName=FEUW&userGroups=feuw,beta', {}));
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

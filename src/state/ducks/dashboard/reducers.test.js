import reducer from './reducers';
import {
  SAVE_DISPOSITION,
  TASKS_NOT_FOUND,
  TASKS_FETCH_ERROR,
  SAVE_EVALID_LOANNUMBER,
  SEARCH_LOAN_RESULT,
  UNASSIGN_LOAN_RESULT,
} from './types';

const saveDispositionAction = {
  type: SAVE_DISPOSITION,
  payload: {
    getNextEnabled: true,
  },
};

const noTasksFoundAction = {
  type: TASKS_NOT_FOUND,
  payload: {
    noTasksFound: true,
  },
};

const saveEvalIdLoanNumberAction = {
  type: SAVE_EVALID_LOANNUMBER,
  payload: {
    evalId: '1234',
    loanNumber: '1234',
    taskId: '1234',
  },
};

const taskFetchErrorAction = {
  type: TASKS_FETCH_ERROR,
  payload: {
    taskfetchError: true,
  },
};

const searchLoanAction = {
  type: SEARCH_LOAN_RESULT,
  payload: {
    loanNumber: '1800840108',
    unAssigned: null,
    assigned: null,
    valid: true,
  },
};

const unAssignLoanPausedAction = {
  type: UNASSIGN_LOAN_RESULT,
  payload: {
    cmodProcess: {
      taskStatus: 'Paused',
    },
  },
};

const unAssignLoanAssignedAction = {
  type: UNASSIGN_LOAN_RESULT,
  payload: {
    cmodProcess: {
      taskStatus: 'Assigned',
    },
  },
};

const unAssignLoanErrorAction = {
  type: UNASSIGN_LOAN_RESULT,
  payload: {
    cmodProcess: {
      taskStatus: 'Error',
    },
  },
};
const state = {};

describe('Ducks :: dashboard -> reducer', () => {
  it('initialization', () => {
    expect(reducer(undefined, { type: 'init' })).toEqual({ firstVisit: true });
  });

  it('Success unAssignLoan action', () => {
    const expectedState = {
      unassignLoanResponse: {
        cmodProcess: {
          taskStatus: 'Paused',
        },
      },
    };
    expect(reducer(state, unAssignLoanPausedAction)).toEqual(expectedState);
  });

  it('Failure unAssignLoan action', () => {
    const expectedState = {
      unassignLoanResponse: {
        cmodProcess: {
          taskStatus: 'Assigned',
        },
      },
    };
    expect(reducer(state, unAssignLoanAssignedAction)).toEqual(expectedState);
  });

  it('Failure unAssignLoan action', () => {
    const expectedState = {
      unassignLoanResponse: {
        cmodProcess: {
          taskStatus: 'Error',
        },
      },
    };
    expect(reducer(state, unAssignLoanErrorAction)).toEqual(expectedState);
  });
  it('saveDisposition action', () => {
    const expectedState = {
      getNextResponse: {
        getNextEnabled: true,
      },
    };
    expect(reducer(state, saveDispositionAction)).toEqual(expectedState);
  });

  it('save evalId and loanNumber action', () => {
    const expectedState = {
      evalId: '1234',
      loanNumber: '1234',
      taskId: '1234',
      taskFetchError: false,
      noTasksFound: false,
      showAssign: null,
      isAssigned: true,
    };
    expect(reducer(state, saveEvalIdLoanNumberAction)).toEqual(expectedState);
  });

  it('noTasksFound action', () => {
    const expectedState = {
      noTasksFound: true,
      evalId: null,
      loanNumber: null,
      taskId: null,
    };
    expect(reducer(state, noTasksFoundAction)).toEqual(expectedState);
  });

  it('taskFetchError action', () => {
    const expectedState = {
      taskFetchError: true,
      evalId: null,
      loanNumber: null,
      taskId: null,
    };
    expect(reducer(state, taskFetchErrorAction)).toEqual(expectedState);
  });

  it('searchLoan Result action', () => {
    const expectedState = {
      clearSearch: true,
      assignLoanResponse: {},
      checklistErrorCode: '',
      unassignLoanResponse: {},
      getSearchLoanResponse: {
        loanNumber: '1800840108',
        unAssigned: null,
        assigned: null,
        valid: true,
      },
    };
    expect(reducer(state, searchLoanAction)).toEqual(expectedState);
  });
});

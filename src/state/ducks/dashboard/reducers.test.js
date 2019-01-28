import reducer from './reducers';
import {
  SAVE_DISPOSITION,
  TASKS_NOT_FOUND,
  TASKS_FETCH_ERROR,
  SAVE_EVALID_LOANNUMBER,
  SEARCH_LOAN_RESULT,
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
    notasksFound: true,
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
const state = {};

describe('Ducks :: dashboard -> reducer', () => {
  it('initialization', () => {
    expect(reducer(undefined, { type: 'init' })).toEqual({ firstVisit: true });
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
      notasksFound: false,
    };
    expect(reducer(state, saveEvalIdLoanNumberAction)).toEqual(expectedState);
  });

  it('notasksFound action', () => {
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
      getSearchLoanResponse: {
        loanNumber: '1800840108',
        unAssigned: null,
        assigned: null,
        valid: true,
      }
    };
    expect(reducer(state, searchLoanAction)).toEqual(expectedState);
  });
});

import {
  select,
  put,
  call,
  takeEvery,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import LoanTombstone from 'models/LoanTombstone';
import { setPaymentDeferral } from 'ducks/dashboard/actions';
import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
  FETCH_TOMBSTONE_DATA,
} from './types';
import { TestExports } from './sagas';
import { selectors as dashboardSelectors } from '../dashboard';

describe('tombstone watcher ', () => {
  it('watchTombstone should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchTombstone)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        FETCH_TOMBSTONE_DATA,
        TestExports.fetchTombstoneData,
      ));
  });
});

describe('fetchTombstoneData', () => {
  const loanNumber = 596400243;
  const payload = {
    payload: {
      loanNumber: 596400243,
      taskName: 'FrontEnd Review',
      taskId: 12345,
    },
  };
  const saga = cloneableGenerator(TestExports.fetchTombstoneData)(payload);
  const loanDetails = {
    loanNumber: '596400243',
    investorCode: '458',
    brandName: 'NSM',
    investorLoanNumber: '0000000',
    upbAmount: 711766.64,
    nextPaymentDueDate: '2013-12-01T00:00:00.000Z',
    investorInformation: {
      investorCode: '458',
      investorName: 'NMST 2007-1                   ',
    },
    primaryBorrower: {
      firstName: 'JOSE',
      lastName: 'DOE',
      borrowerType: 'Borrower',
    },
    coBorrowers: [
      {
        firstName: 'ARMIDA',
        lastName: 'DOE',
        borrowerType: 'Co-Borrower',
      },
    ],
  };
  it('should update LOADING DATA in store', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: LOADING_TOMBSTONE_DATA,
      }));
  });
  it('should select loanNumber from store', () => {
    expect(saga.next().value)
      .toEqual(select(dashboardSelectors.loanNumber));
  });
  it('should select evalId from store', () => {
    expect(saga.next(loanNumber).value)
      .toEqual(select(dashboardSelectors.evalId));
  });

  it('should select groupName from store', () => {
    expect(saga.next(1161415).value)
      .toEqual(select(dashboardSelectors.groupName));
  });

  it('should select Stager Task from store', () => {
    expect(saga.next('FrontEnd Review').value)
      .toEqual(select(dashboardSelectors.stagerTaskName));
  });

  it('should select brand from store', () => {
    expect(saga.next('FrontEnd Review').value)
      .toEqual(select(dashboardSelectors.brand));
  });

  it('should call sods api to fetch loan details', () => {
    expect(saga.next('NSM').value)
      .toEqual(call(LoanTombstone.fetchData, 596400243, 1161415, 'FrontEnd Review', 'FrontEnd Review', 12345, 'NSM'));
  });
  it('should update isPayment deferral', () => {
    expect(saga.next(loanDetails).value).toEqual(call(setPaymentDeferral, false));
  });
  it('should update isPayment deferral', () => {
    expect(saga.next({
      type: 'app/dashboard/SET_PAYMENT_DEFERRAL',
      payload: false,
    }).value).toEqual(put({
      type: 'app/dashboard/SET_PAYMENT_DEFERRAL',
      payload: false,
    }));
  });
  it('should update loandetails in store', () => {
    expect(saga.next().value)
      .toEqual(put({ type: SUCCESS_LOADING_TOMBSTONE_DATA, payload: loanDetails }));
  });
});

describe('fetchTombStoneData should throw error on error to fetch data', () => {
  const payload = {
    payload: {
      loanNumber: 596400243,
      taskName: 'FrontEnd Review',
      taskId: 12345,
    },
  };
  const saga = cloneableGenerator(TestExports.fetchTombstoneData)(payload);
  const loanNumber = 596400243;
  it('should update LOADING DATA in store', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: LOADING_TOMBSTONE_DATA,
      }));
  });

  it('should select loanNumber from store', () => {
    expect(saga.next().value)
      .toEqual(select(dashboardSelectors.loanNumber));
  });

  it('should select evalId from store', () => {
    expect(saga.next(loanNumber).value)
      .toEqual(select(dashboardSelectors.evalId));
  });


  it('should select groupName from store', () => {
    expect(saga.next(1161415).value)
      .toEqual(select(dashboardSelectors.groupName));
  });

  it('should select Stager Task from store', () => {
    expect(saga.next('FrontEnd Review').value)
      .toEqual(select(dashboardSelectors.stagerTaskName));
  });

  it('should select Brand from store', () => {
    expect(saga.next('FrontEnd Review').value)
      .toEqual(select(dashboardSelectors.brand));
  });

  it('should call sods api to fetch loan details', () => {
    expect(saga.next('NSM').value)
      .toEqual(call(LoanTombstone.fetchData, 596400243, 1161415, 'FrontEnd Review', 'FrontEnd Review', 12345, 'NSM'));
  });

  it('should update store with ERROR_LOADING_TOMBSTONE_DATA on error', () => {
    expect(saga.throw(new Error('loan fetch failed')).value)
      .toEqual(put({ type: ERROR_LOADING_TOMBSTONE_DATA, payload: { data: [{ title: 'Loan #', content: loanNumber }, { title: 'EvalId', content: 1161415 }], error: false, loading: false } }));
  });
});

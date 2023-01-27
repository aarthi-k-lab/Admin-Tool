import {
  select,
  put,
  call,
  takeEvery,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import LoanTombstone from 'models/LoanTombstone';
import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  FETCH_TOMBSTONE_DATA,
  SET_RFDTABLE_DATA,
} from './types';
import { STORE_INVEST_CD_AND_BRAND_NM, SET_RESOLUTION_AND_INVSTR_HRCHY, SET_BRAND } from '../dashboard/types';
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
  const investorData = {
    investorCode: '',
    brandName: 'NSM',
    resolutionId: '',
    investorHierarchy: {},
    tombstoneData: [],
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


  it('should select resolutionId from store', () => {
    expect(saga.next('FrontEnd Review').value)
      .toEqual(select(dashboardSelectors.selectedResolutionId));
  });

  it('should select brand from store', () => {
    expect(saga.next(78790).value)
      .toEqual(select(dashboardSelectors.brand));
  });

  it('should call sods api to fetch loan details', () => {
    expect(saga.next('NSM').value)
      .toEqual(call(LoanTombstone.fetchData, 596400243, 1161415, 'FrontEnd Review', 'FrontEnd Review', 12345, 'NSM', 78790));
  });

  it('should dispatch STORE_INVEST_CD_AND_BRAND_NM', () => {
    expect(saga.next(investorData).value)
      .toEqual(put({
        type: STORE_INVEST_CD_AND_BRAND_NM,
        payload: { investorCode: '', brandName: 'NSM' },
      }));
  });
  it('should dispatch SET_BRAND to store BrandName', () => {
    expect(saga.next({
      brand: 'NSM',
    }).value).toEqual(put({
      type: SET_BRAND,
      payload: 'NSM',
    }));
  });
  it('should dispatch SET_RESOLUTION_AND_INVSTR_HRCHY', () => {
    expect(saga.next({
      resolutionId: '',
      investorHierarchy: {},
      tombstoneData: [],
    }).value)
      .toEqual(put({
        type: SET_RESOLUTION_AND_INVSTR_HRCHY,
        payload: { resolutionId: '', investorHierarchy: {} },
      }));
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

  it('should select resolutionId from store', () => {
    expect(saga.next('FrontEnd Review').value)
      .toEqual(select(dashboardSelectors.selectedResolutionId));
  });

  it('should select Brand from store', () => {
    expect(saga.next(78790).value)
      .toEqual(select(dashboardSelectors.brand));
  });

  it('should call sods api to fetch loan details', () => {
    expect(saga.next('NSM').value)
      .toEqual(call(LoanTombstone.fetchData, 596400243, 1161415, 'FrontEnd Review', 'FrontEnd Review', 12345, 'NSM', 78790));
  });

  it('should update store with ERROR_LOADING_TOMBSTONE_DATA on error', () => {
    expect(saga.throw(new Error('loan fetch failed')).value)
      .toEqual(put({ type: ERROR_LOADING_TOMBSTONE_DATA, payload: { data: [{ title: 'Loan #', content: loanNumber }, { title: 'EvalId', content: 1161415 }], error: false, loading: false } }));
  });
});

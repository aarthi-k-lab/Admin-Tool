import {
  select, put, call, takeEvery,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import { TestExports } from './sagas';
import selectors from './selectors';


import {
  GET_DASHBOARD_COUNTS_SAGA,
  SET_STAGER_DATA_COUNTS,
  GET_DASHBOARD_DATA_SAGA,
  SET_STAGER_DATA,
  SET_STAGER_DATA_LOADING,
  TABLE_CHECKBOX_SELECT,
  TABLE_CHECKBOX_SELECT_TRIGGER,
  TRIGGER_ORDER_SAGA,
  SET_STAGER_ACTIVE_SEARCH_TERM,
} from './types';
import { SET_SNACK_BAR_VALUES_SAGA } from '../notifications/types';

describe('stager watcher ', () => {
  it('watchDashboardCountsFetch should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchDashboardCountsFetch)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        GET_DASHBOARD_COUNTS_SAGA,
        TestExports.fetchDashboardCounts,
      ));
  });
  it('watchOrderCall should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchOrderCall)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        TRIGGER_ORDER_SAGA,
        TestExports.makeOrderBpmCall,
      ));
  });
  it('watchDashboardDataFetch should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchDashboardDataFetch)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        GET_DASHBOARD_DATA_SAGA,
        TestExports.fetchDashboardData,
      ));
  });
  it('watchTableCheckboxSelect should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchTableCheckboxSelect)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        TABLE_CHECKBOX_SELECT_TRIGGER,
        TestExports.onCheckboxSelect,
      ));
  });
  it('fireSnackBar should be triggered', () => {
    const saga = cloneableGenerator(TestExports.fireSnackBar)([]);
    expect(saga.next().value)
      .toEqual(put({
        type: SET_SNACK_BAR_VALUES_SAGA,
        payload: [],
      }));
  });
});

describe('onCheckboxSelect ', () => {
  it('onCheckboxSelect should be triggered', () => {
    const data = { payload: [] };
    const saga = cloneableGenerator(TestExports.onCheckboxSelect)(data);
    expect(saga.next().value)
      .toEqual(put({
        type: TABLE_CHECKBOX_SELECT,
        payload: {
          error: false,
          selectedData: data.payload,
        },
      }));
  });
});
const dateValue = {
  fromDate: '2019-01-05',
  stagerType: 'UNDERWRITER STAGER',
  toDate: '2019-01-05',
  searchTerm: null,
};
describe('fetchDashboardCounts ', () => {
  const saga = cloneableGenerator(TestExports.fetchDashboardCounts)();
  it('should select Stager type ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select Stager date ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('call getCounts Api', () => {
    expect(saga.next(dateValue).value)
      .toEqual(call(Api.callPost, 'api/stager/dashboard/getCountsByDate', dateValue));
  });
  it('should update with returned payload ', () => {
    const data = { displayName: 'CurrentReview' };
    expect(saga.next(data).value)
      .toEqual(put({ type: SET_STAGER_DATA_COUNTS, payload: data }));
  });
});


describe('fetchDashboardData ', () => {
  const payload = {
    payload: {
      activeSearchTerm: 'LegalFeeToOrder',
      stager: 'UNDERWRITER STAGER',
      toDate: '2019-01-05',
      fromDate: '2019-01-05',
    },
  };
  const date = {
    fromDate: '2019-01-05',
    stagerType: 'UNDERWRITER STAGER',
    searchTerm: 'LegalFeeToOrder',
    toDate: '2019-01-05',
    stagerPageOffSet: 1,
    maxFetchCount: 10,
  };
  const pagePayload = {
    PageCount: 1,
    maxFetchCount: 10,
  };
  const newPayload = [];
  const saga = cloneableGenerator(TestExports.fetchDashboardData)(payload);

  it('should update as loading ', () => {
    expect(saga.next(payload).value)
      .toEqual(put({
        type: SET_STAGER_DATA_LOADING,
        payload: {
          error: false,
          loading: true,
        },
      }));
  });
  it('should select Stager date ', () => {
    expect(saga.next('UW_STAGER').value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('should select Max Page Count ', () => {
    expect(saga.next(date).value)
      .toEqual(select(selectors.getStagerPageCount));
  });
  it('call bpm audit data Api', () => {
    expect(saga.next(pagePayload).value)
      .toEqual(call(Api.callPost, 'api/stager/dashboard/getDataByDate', date));
  });

  it('should update searchterm ', () => {
    expect(saga.next(newPayload).value)
      .toEqual(put({
        type: SET_STAGER_ACTIVE_SEARCH_TERM,
        payload: 'LegalFeeToOrder',
      }));
  });

  it('should update payload ', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: SET_STAGER_DATA,
        payload: {
          error: false,
          data: [],
        },
      }));
  });
});

describe('fetchDashboardData error', () => {
  const saga = cloneableGenerator(TestExports.fetchDashboardData)(undefined);
  it('should update payload ', () => {
    expect(saga.next().value)
      .toEqual(put({
        type: SET_STAGER_DATA,
        payload: {
          error: true,
          message: 'Oops. There is some issue in fetching the data now. Try again later',
        },
      }));
  });
});

describe('makeOrderBpmCall', () => {
  const payload = { payload: 'LegalFeeToOrder' };
  const message = {
    message: 'Ordering. Please wait... ',
    open: true,
    type: 'message',
  };
  const saga = cloneableGenerator(TestExports.makeOrderBpmCall)(payload);
  const snackBarData = {};
  snackBarData.message = 'Order call failed for Eval ID(s): ';
  snackBarData.type = 'error';
  snackBarData.open = true;
  it('should call firesnackbar ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, message));
  });

  it('call stager Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, 'api/stager/stager/dashboard/order/valuation', payload.payload));
  });

  it('should call fetchDashboardCounts ', () => {
    expect(saga.next([{ error: true, data: [{ evalId: 123456 }] }]).value)
      .toEqual(call(TestExports.fetchDashboardCounts));
  });

  it('should select activesearchterm ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });

  it('should call fetchDashboardData ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(call(TestExports.fetchDashboardData, { payload: 'LegalFeeToOrder' }));
  });
  it('should call onCheckboxSelect ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(call(TestExports.onCheckboxSelect, { payload: [] }));
  });
  it('should call fireSnackBar ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, snackBarData));
  });
});

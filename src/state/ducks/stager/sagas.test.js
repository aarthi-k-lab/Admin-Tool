import {
  select, put, call, takeEvery,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as Api from 'lib/Api';
import {
  selectors as loginSelectors,
} from 'ducks/login/index';
import { TestExports } from './sagas';
import selectors from './selectors';


import {
  GET_DASHBOARD_COUNTS_SAGA,
  SET_STAGER_DATA_COUNTS,
  GET_DASHBOARD_DATA_SAGA,
  GET_DOWNLOAD_DATA_SAGA,
  GET_STAGER_LOAN_NUMBER,
  SET_STAGER_DATA,
  SET_STAGER_DATA_LOADING,
  SET_DOWNLOAD_DATA,
  SET_DOC_GEN_RESPONSE,
  TABLE_CHECKBOX_SELECT,
  TABLE_CHECKBOX_SELECT_TRIGGER,
  TRIGGER_ORDER_SAGA,
  SET_STAGER_ACTIVE_SEARCH_TERM,
  SEARCH_STAGER_LOAN_NUMBER,
  SET_STAGER_LOAN_NUMBER,
  TRIGGER_DISPOSITION_OPERATION_SAGA,
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
  it('watchDashboardDataFetch should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchDashboardDataFetch)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        GET_DASHBOARD_DATA_SAGA,
        TestExports.fetchDashboardData,
      ));
  });
  it('watchDownloadDataFetch should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchDownloadDataFetch)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        GET_DOWNLOAD_DATA_SAGA,
        TestExports.fetchDownloadData,
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
  it('watchOrderCall should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchOrderCall)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        TRIGGER_ORDER_SAGA,
        TestExports.makeOrderBpmCall,
      ));
  });
  it('watchDispositionOperationCall should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchDispositionOperationCall)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        TRIGGER_DISPOSITION_OPERATION_SAGA,
        TestExports.makeDispositionOperationCall,
      ));
  });
  it('watchStagerSearchLoanCall should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchStagerSearchLoanCall)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        GET_STAGER_LOAN_NUMBER,
        TestExports.makeStagerSearchLoanCall,
      ));
  });
});

const dateValue = {
  fromDate: '2019-01-05T00:00:00.000Z',
  stagerType: 'UNDERWRITER STAGER',
  toDate: '2019-01-05T00:00:00.000Z',
  searchTerm: null,
};
const dateUTCValue = {
  fromDate: '2019-01-05',
  stagerType: 'UNDERWRITER STAGER',
  toDate: '2019-01-05',
  searchTerm: null,
  azureSearchToggle: false,
};
const mockUser = {
  userDetails: {
    email: 'bren@mrcooper.com',
  },
};

describe('fetchDashboardCounts - success', () => {
  const saga = cloneableGenerator(TestExports.fetchDashboardCounts)();
  it('should Check user ', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should select Stager type ', () => {
    expect(saga.next(mockUser).value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select Stager date ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('call getCounts Api', () => {
    expect(saga.next(dateUTCValue).value)
      .toEqual(call(Api.callPost, 'api/stager/dashboard/getCountsByDate', dateValue));
  });
  it('should update with returned payload ', () => {
    const data = { displayName: 'CurrentReview' };
    expect(saga.next(data).value)
      .toEqual(put({ type: SET_STAGER_DATA_COUNTS, payload: data }));
  });
  it('should complete', () => {
    expect(saga.next().done)
      .toEqual(true);
  });
});
describe('fetchDashboardCounts - empty user value', () => {
  const saga = cloneableGenerator(TestExports.fetchDashboardCounts)();
  it('should Check user ', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should complete', () => {
    expect(saga.next({}).done)
      .toEqual(true);
  });
});
describe('fetchDashboardCounts - null response', () => {
  const saga = cloneableGenerator(TestExports.fetchDashboardCounts)();
  it('should Check user ', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should select Stager type ', () => {
    expect(saga.next(mockUser).value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select Stager date ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('call getCounts Api', () => {
    expect(saga.next(dateUTCValue).value)
      .toEqual(call(Api.callPost, 'api/stager/dashboard/getCountsByDate', dateValue));
  });
  it('should complete', () => {
    expect(saga.next(null).done)
      .toEqual(true);
  });
});
describe('fetchDashboardCounts - error', () => {
  const saga = cloneableGenerator(TestExports.fetchDashboardCounts)();
  it('should Check user ', () => {
    expect(saga.next().value)
      .toEqual(select(loginSelectors.getUser));
  });

  it('should select Stager type ', () => {
    expect(saga.next(mockUser).value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select Stager date ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('should update state with empty payload', () => {
    expect(saga.next(null).value)
      .toEqual(put({ type: SET_STAGER_DATA_COUNTS, payload: {} }));
  });
  it('should complete', () => {
    expect(saga.next().done)
      .toEqual(true);
  });
});
describe('fetchDashboardData - success ', () => {
  const payload = {
    payload: {
      activeSearchTerm: 'LegalFeeToOrder',
      stager: 'UNDERWRITER STAGER',
      toDate: '2019-01-05',
      fromDate: '2019-01-05',
    },
  };
  const date = {
    fromDate: '2019-01-05T00:00:00.000Z',
    stagerType: 'UNDERWRITER STAGER',
    searchTerm: 'LegalFeeToOrder',
    toDate: '2019-01-05T00:00:00.000Z',
  };
  const dateUtc = {
    fromDate: '2019-01-05',
    stagerType: 'UNDERWRITER STAGER',
    searchTerm: 'LegalFeeToOrder',
    toDate: '2019-01-05',
  };
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
    expect(saga.next().value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('get azure search toggle ', () => {
    expect(saga.next(dateUtc).value)
      .toEqual(select(selectors.getAzureSearchToggle));
  });
  it('call bpm audit data Api', () => {
    expect(saga.next(false).value)
      .toEqual(call(Api.callPost, 'api/stager/dashboard/getDataByDate', date));
  });
  it('should update searchterm ', () => {
    expect(saga.next([]).value)
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
describe('fetchDashboardData - error', () => {
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
  it('should complete ', () => {
    expect(saga.next().done)
      .toEqual(true);
  });
});
describe('fetchDashboardData - empty response', () => {
  const payload = {
    payload: {
      activeSearchTerm: 'LegalFeeToOrder',
      stager: 'UNDERWRITER STAGER',
      toDate: '2019-01-05',
      fromDate: '2019-01-05',
    },
  };
  const date = {
    fromDate: '2019-01-05T00:00:00.000Z',
    stagerType: 'UNDERWRITER STAGER',
    searchTerm: 'LegalFeeToOrder',
    toDate: '2019-01-05T00:00:00.000Z',
  };
  const dateUtc = {
    fromDate: '2019-01-05',
    stagerType: 'UNDERWRITER STAGER',
    searchTerm: 'LegalFeeToOrder',
    toDate: '2019-01-05',
  };
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
    expect(saga.next().value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('should select Stager date ', () => {
    expect(saga.next(dateUtc).value)
      .toEqual(select(selectors.getAzureSearchToggle));
  });
  it('call bpm audit data Api', () => {
    expect(saga.next(false).value)
      .toEqual(call(Api.callPost, 'api/stager/dashboard/getDataByDate', date));
  });
  it('should update searchterm ', () => {
    expect(saga.next(null).value)
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
        },
      }));
  });
  it('should complete ', () => {
    expect(saga.next().done)
      .toEqual(true);
  });
});
describe('fetchDownloadData - success', () => {
  const action = {
    payload: () => {},
  };

  const saga = cloneableGenerator(TestExports.fetchDownloadData)(action);
  it('should select Stager value ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select active search term ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });
  it('should select stager date ', () => {
    expect(saga.next(null).value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('should select stager date ', () => {
    expect(saga.next(dateUTCValue).value)
      .toEqual(select(selectors.getAzureSearchToggle));
  });
  it('call downloadDataByDate Api', () => {
    expect(saga.next(false).value)
      .toEqual(call(Api.callPost, 'api/stager/dashboard/downloadDataByDate', { ...dateValue, azureSearchToggle: false }));
  });
  it('update download response in state', () => {
    expect(saga.next({ response: 'data' }).value)
      .toEqual(put({ type: SET_DOWNLOAD_DATA, payload: { response: 'data' } }));
  });
  it('should complete', () => {
    expect(saga.next().done).toEqual(true);
  });
});
describe('fetchDownloadData - null response', () => {
  const action = {
    payload: () => {},
  };
  const saga = cloneableGenerator(TestExports.fetchDownloadData)(action);
  it('should select Stager value ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select active search term ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });
  it('should select stager date ', () => {
    expect(saga.next(null).value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('should select stager date ', () => {
    expect(saga.next(dateUTCValue).value)
      .toEqual(select(selectors.getAzureSearchToggle));
  });
  it('call downloadDataByDate Api', () => {
    expect(saga.next(false).value)
      .toEqual(call(Api.callPost, 'api/stager/dashboard/downloadDataByDate', { ...dateValue, azureSearchToggle: false }));
  });
  it('should complete', () => {
    expect(saga.next(null).done).toEqual(true);
  });
});
describe('fetchDownloadData - error', () => {
  const action = {
    payload: () => {},
  };
  const saga = cloneableGenerator(TestExports.fetchDownloadData)(action);
  it('should select Stager value ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select active search term ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });
  it('should select stager date ', () => {
    expect(saga.next(null).value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('should select stager date ', () => {
    expect(saga.next(null).value)
      .toEqual(select(selectors.getAzureSearchToggle));
  });
  it('should update state with empty payload', () => {
    expect(saga.next(false).value)
      .toEqual(put({ type: SET_DOWNLOAD_DATA, payload: {} }));
  });
  it('should complete', () => {
    expect(saga.next().done)
      .toEqual(true);
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
describe('fireSnackBar', () => {
  it('should set snack barvalues', () => {
    const saga = cloneableGenerator(TestExports.fireSnackBar)([]);
    expect(saga.next().value)
      .toEqual(put({
        type: SET_SNACK_BAR_VALUES_SAGA,
        payload: [],
      }));
  });
});
describe('setDocGenData', () => {
  it('should set doc gen data', () => {
    const saga = cloneableGenerator(TestExports.setDocGenData)([]);
    expect(saga.next().value)
      .toEqual(put({
        type: SET_DOC_GEN_RESPONSE,
        payload: [],
      }));
  });
});
describe('makeOrderBpmCall - order failed for <= 5 evalIds', () => {
  const payload = { payload: 'LegalFeeToOrder', endPoint: 'valuation' };
  const message = {
    message: 'Ordering. Please wait... ',
    open: true,
    type: 'message',
  };
  const saga = cloneableGenerator(TestExports.makeOrderBpmCall)(payload);
  const snackBarData = {
    message: 'Order call failed for Eval ID(s): ',
    type: 'error',
    open: true,
  };
  const stagerPayload = { activeSearchTerm: 'LegalFeeToOrder', stager: 'UW_STAGER' };
  it('should call firesnackbar ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, message));
  });

  it('call stager Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, `api/stager/stager/dashboard/order/${payload.endPoint}`, payload.payload));
  });

  it('should call fetchDashboardCounts ', () => {
    expect(saga.next([{ error: true, data: [{ evalId: 123456 }], message: 'Order call failed for Eval ID(s): ' }]).value)
      .toEqual(call(TestExports.fetchDashboardCounts));
  });

  it('should select activesearchterm ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });

  it('should select StagerType ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(select(selectors.getStagerValue));
  });

  it('should call fetchDashboardData ', () => {
    expect(saga.next('UW_STAGER').value)
      .toEqual(call(TestExports.fetchDashboardData, { payload: stagerPayload }));
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
describe('makeOrderBpmCall - order failed for > 5 evalIds', () => {
  const payload = { payload: 'LegalFeeToOrder', endPoint: 'valuation' };
  const message = {
    message: 'Ordering. Please wait... ',
    open: true,
    type: 'message',
  };
  const saga = cloneableGenerator(TestExports.makeOrderBpmCall)(payload);
  const snackBarData = {
    message: 'Order call failed for more than 5 Eval ID(s): Contact Admin!',
    type: 'error',
    open: true,
  };

  const mockResponse = [
    { error: true, message: 'Order call failed' },
    { error: true, message: 'Order call failed' },
    { error: true, message: 'Order call failed' },
    { error: true, message: 'Order call failed' },
    { error: true, message: 'Order call failed' },
    { error: true, message: 'Order call failed' },
  ];
  const stagerPayload = { activeSearchTerm: 'LegalFeeToOrder', stager: 'UW_STAGER' };
  it('should call firesnackbar ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, message));
  });

  it('call stager Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, `api/stager/stager/dashboard/order/${payload.endPoint}`, payload.payload));
  });

  it('should call fetchDashboardCounts ', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(call(TestExports.fetchDashboardCounts));
  });

  it('should select activesearchterm ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });

  it('should select StagerType ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(select(selectors.getStagerValue));
  });

  it('should call fetchDashboardData ', () => {
    expect(saga.next('UW_STAGER').value)
      .toEqual(call(TestExports.fetchDashboardData, { payload: stagerPayload }));
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
describe('makeOrderBpmCall - order in progress', () => {
  const payload = { payload: 'LegalFeeToOrder', endPoint: 'valuation' };
  const message = {
    message: 'Ordering. Please wait... ',
    open: true,
    type: 'message',
  };
  const saga = cloneableGenerator(TestExports.makeOrderBpmCall)(payload);
  const snackBarData = {
    message: 'Ordering in Progress...',
    type: 'warning',
    open: true,
  };

  const mockResponse = [
    { error: true, message: 'Ordering in Progress...' },
  ];
  const stagerPayload = { activeSearchTerm: 'LegalFeeToOrder', stager: 'UW_STAGER' };
  it('should call firesnackbar ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, message));
  });

  it('call stager Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, `api/stager/stager/dashboard/order/${payload.endPoint}`, payload.payload));
  });

  it('should call fetchDashboardCounts ', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(call(TestExports.fetchDashboardCounts));
  });

  it('should select activesearchterm ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });

  it('should select StagerType ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(select(selectors.getStagerValue));
  });

  it('should call fetchDashboardData ', () => {
    expect(saga.next('UW_STAGER').value)
      .toEqual(call(TestExports.fetchDashboardData, { payload: stagerPayload }));
  });
  it('should call onCheckboxSelect ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(call(TestExports.onCheckboxSelect, { payload: [] }));
  });
  it('should call fireSnackBar with type - warning', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, snackBarData));
  });
});
describe('makeOrderBpmCall - order success', () => {
  const payload = { payload: 'LegalFeeToOrder', endPoint: 'valuation' };
  const message = {
    message: 'Ordering. Please wait... ',
    open: true,
    type: 'message',
  };
  const saga = cloneableGenerator(TestExports.makeOrderBpmCall)(payload);
  const snackBarData = {
    message: 'Ordered Successfully!',
    type: 'success',
    open: true,
  };

  const mockResponse = [
    { error: false, message: 'Ordering successful' },
  ];
  const stagerPayload = { activeSearchTerm: 'LegalFeeToOrder', stager: 'UW_STAGER' };
  it('should call firesnackbar ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, message));
  });

  it('call stager Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, `api/stager/stager/dashboard/order/${payload.endPoint}`, payload.payload));
  });

  it('should call fetchDashboardCounts ', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(call(TestExports.fetchDashboardCounts));
  });

  it('should select activesearchterm ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });

  it('should select StagerType ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(select(selectors.getStagerValue));
  });

  it('should call fetchDashboardData ', () => {
    expect(saga.next('UW_STAGER').value)
      .toEqual(call(TestExports.fetchDashboardData, { payload: stagerPayload }));
  });
  it('should call onCheckboxSelect ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(call(TestExports.onCheckboxSelect, { payload: [] }));
  });
  it('should call fireSnackBar with type - success', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, snackBarData));
  });
});
describe('makeOrderBpmCall - error', () => {
  const payload = { payload: 'LegalFeeToOrder', endPoint: 'valuation' };
  const message = {
    message: 'Ordering. Please wait... ',
    open: true,
    type: 'message',
  };
  const saga = cloneableGenerator(TestExports.makeOrderBpmCall)(payload);
  const snackBarData = {
    message: 'Something went wrong!!',
    type: 'error',
    open: true,
  };

  const mockResponse = [
    { error: true, message: 'Ordering failed' },
  ];
  const stagerPayload = { activeSearchTerm: 'LegalFeeToOrder', stager: 'UW_STAGER' };
  it('should call firesnackbar ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, message));
  });

  it('call stager Api', () => {
    expect(saga.next().value)
      .toEqual(call(Api.callPost, `api/stager/stager/dashboard/order/${payload.endPoint}`, payload.payload));
  });

  it('should call fetchDashboardCounts ', () => {
    expect(saga.next(mockResponse).value)
      .toEqual(call(TestExports.fetchDashboardCounts));
  });

  it('should select activesearchterm ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });

  it('should select StagerType ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(select(selectors.getStagerValue));
  });

  it('should call fetchDashboardData ', () => {
    expect(saga.next('UW_STAGER').value)
      .toEqual(call(TestExports.fetchDashboardData, { payload: stagerPayload }));
  });
  it('should call onCheckboxSelect ', () => {
    expect(saga.next('LegalFeeToOrder').value)
      .toEqual(call(TestExports.onCheckboxSelect, { payload: [] }));
  });
  it('should call fireSnackBar with type - error', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.fireSnackBar, snackBarData));
  });
});
describe('makeStagerSearchLoanCall - success', () => {
  const payload = { payload: '123456789' };
  const saga = cloneableGenerator(TestExports.makeStagerSearchLoanCall)(payload);

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
      .toEqual(call(Api.callPost, '/api/stager/dashboard/getSearchLoanNumber', { ...dateValue, loanNumber: '123456789' }));
  });
  it('should trigger SEARCH_STAGER_LOAN_NUMBER', () => {
    expect(saga.next([]).value)
      .toEqual(put({ type: SEARCH_STAGER_LOAN_NUMBER, payload: [] }));
  });
  it('should trigger SET_STAGER_LOAN_NUMBER ', () => {
    expect(saga.next().value)
      .toEqual(put({ type: SET_STAGER_LOAN_NUMBER, payload: '123456789' }));
  });
});
describe('makeStagerSearchLoanCall - error', () => {
  const payload = { payload: '123456789' };
  const saga = cloneableGenerator(TestExports.makeStagerSearchLoanCall)(payload);

  it('should select Stager type ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select Stager date ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(selectors.getStagerStartEndDate));
  });
  it('should handle error', () => {
    expect(saga.next(null).value)
      .toEqual(put({ type: SEARCH_STAGER_LOAN_NUMBER, payload: {} }));
  });
});
describe('makeDispositionOperationCall - success', () => {
  const payload = { payload: { taskList: [], group: 'mockGroup' } };
  const saga = cloneableGenerator(TestExports.makeDispositionOperationCall)(payload);

  it('should doc gen action ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getdocGenAction));
  });
  it('should select Stager value ', () => {
    expect(saga.next('mock').value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select user ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(loginSelectors.getUser));
  });
  it('should call disposition api', () => {
    expect(saga.next(mockUser).value)
      .toEqual(call(Api.callPost, 'api/disposition/disposition/bulk?assignedTo=bren@mrcooper.com&group=mockGroup&disposition=mock', { taskList: [] }));
  });
  it('should select previous doc gen response ', () => {
    expect(saga.next({}).value)
      .toEqual(select(selectors.getdocGenResponse));
  });
  it('should call fetchDashboardCounts ', () => {
    expect(saga.next({}).value)
      .toEqual(call(TestExports.fetchDashboardCounts));
  });
  it('should select stager search term ', () => {
    expect(saga.next({}).value)
      .toEqual(select(selectors.getActiveSearchTerm));
  });
  it('should call fetchDashboardData ', () => {
    expect(saga.next('SEARCH TERM').value)
      .toEqual(call(TestExports.fetchDashboardData, { payload: { activeSearchTerm: 'SEARCH TERM', stager: 'UNDERWRITER STAGER' } }));
  });
  it('should call onCheckboxSelect ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.onCheckboxSelect, { payload: [] }));
  });
  it('should call setDocGenData ', () => {
    expect(saga.next().value)
      .toEqual(call(TestExports.setDocGenData, { hitLoans: [], missedLoans: [] }));
  });
});
describe('makeDispositionOperationCall - error', () => {
  const payload = { payload: { taskList: [], group: 'mockGroup' } };
  const snackBarData = {
    message: 'Something went wrong!!',
    type: 'error',
    open: true,
  };
  const saga = cloneableGenerator(TestExports.makeDispositionOperationCall)(payload);

  it('should doc gen action ', () => {
    expect(saga.next().value)
      .toEqual(select(selectors.getdocGenAction));
  });
  it('should select Stager value ', () => {
    expect(saga.next('mock').value)
      .toEqual(select(selectors.getStagerValue));
  });
  it('should select user ', () => {
    expect(saga.next('UNDERWRITER STAGER').value)
      .toEqual(select(loginSelectors.getUser));
  });
  it('should call disposition api', () => {
    expect(saga.next(mockUser).value)
      .toEqual(call(Api.callPost, 'api/disposition/disposition/bulk?assignedTo=bren@mrcooper.com&group=mockGroup&disposition=mock', { taskList: [] }));
  });
  it('should select previous doc gen response ', () => {
    expect(saga.next({}).value)
      .toEqual(select(selectors.getdocGenResponse));
  });
  it('should handle error ', () => {
    expect(saga.next(null).value)
      .toEqual(call(TestExports.fireSnackBar, snackBarData));
  });
});

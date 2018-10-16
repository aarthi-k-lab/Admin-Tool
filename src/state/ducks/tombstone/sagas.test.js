import { put, call,takeEvery } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
  FETCH_TOMBSTONE_DATA,
} from './types';
import { TestExports } from './sagas';
import LoanTombstone from 'models/LoanTombstone';


describe('tombstone watcher ', () => {
  it('watchTombstone should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchTombstone)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        FETCH_TOMBSTONE_DATA,
        TestExports.fetchTombstoneData
      ));
  });
});

  describe('fetchTombstoneData', () => {
    const saga = cloneableGenerator(TestExports.fetchTombstoneData)();
    const loanDetails = {
   "loanNumber": "596400243",
   "investorCode": "458",
   "brandName": "NSM",
   "investorLoanNumber": "0000000",
   "upbAmount": 711766.64,
   "nextPaymentDueDate": "2013-12-01T00:00:00.000Z",
   "investorInformation": {
       "investorCode": "458",
       "investorName": "NMST 2007-1                   "
   },
   "primaryBorrower": {
       "firstName": "JOSE",
       "lastName": "DOE",
       "borrowerType": "Borrower"
   },
   "coBorrowers": [
       {
           "firstName": "ARMIDA",
           "lastName": "DOE",
           "borrowerType": "Co-Borrower"
       }
   ]
};
    it('should update LOADING DATA in store', () => {
          expect(saga.next().value)
            .toEqual(put({
              type: LOADING_TOMBSTONE_DATA}));
    });
    it('should call sods api to fetch loan details', () => {
          expect(saga.next().value)
            .toEqual(call(LoanTombstone.fetchData, 596400243));
    });
    it('should update loandetails in store', () => {
          expect(saga.next(loanDetails).value)
            .toEqual(put({type: SUCCESS_LOADING_TOMBSTONE_DATA, payload: loanDetails }));
    });
  });

  describe('fetchTombStoneData should throw error on error to fetch data',() => {
    const saga = cloneableGenerator(TestExports.fetchTombstoneData)();
    it('should update LOADING DATA in store', () => {
          expect(saga.next().value)
            .toEqual(put({
              type: LOADING_TOMBSTONE_DATA}));
    });
    it('should call sods api to fetch loan details', () => {
          expect(saga.next().value)
            .toEqual(call(LoanTombstone.fetchData, 596400243));
    });

    it('should update store with ERROR_LOADING_TOMBSTONE_DATA on error',() => {
      expect(saga.throw(new Error('loan fetch failed')).value)
        .toEqual(put({type: ERROR_LOADING_TOMBSTONE_DATA }));
    });
  }) ;

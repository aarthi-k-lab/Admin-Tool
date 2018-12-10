import {
  select, put, call, takeEvery,
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { TestExports } from './sagas';
import { SET_SNACK_BAR_VALUES_SAGA, SET_SNACK_BAR_VALUES } from './types';

describe('notifications watcher ', () => {
  it('watchSnackBarStateChange should be triggered', () => {
    const saga = cloneableGenerator(TestExports.watchSnackBarStateChange)();
    expect(saga.next().value)
      .toEqual(takeEvery(
        SET_SNACK_BAR_VALUES_SAGA,
        TestExports.setSnackBarStates,
      ));
  });
});


describe('setSnackBarStates ', () => {
  it('setSnackBarStates should be triggered', () => {
    const payload = { payload: { notification: '' } };
    const saga = cloneableGenerator(TestExports.setSnackBarStates)(payload);
    expect(saga.next().value)
      .toEqual(put({
        type: SET_SNACK_BAR_VALUES,
        payload: payload.payload,
      }));
  });
  it('setSnackBarStates should be triggered with error', () => {
    const payload = undefined;
    const saga = cloneableGenerator(TestExports.setSnackBarStates)(payload);
    expect(saga.next().value)
      .toEqual(put({
        type: SET_SNACK_BAR_VALUES,
        payload: {},
      }));
  });
});

import reducer, { TestHooks } from './reducers';
import {
  LOADING_TOMBSTONE_DATA,
  ERROR_LOADING_TOMBSTONE_DATA,
  SUCCESS_LOADING_TOMBSTONE_DATA,
} from './types';

const errorAction = { type: ERROR_LOADING_TOMBSTONE_DATA };
const loadingAction = { type: LOADING_TOMBSTONE_DATA };
const successAction = {
  type: SUCCESS_LOADING_TOMBSTONE_DATA,
  payload: [
    {
      title: 'title1',
      content: 'content1',
    },
  ],
};

const state = {
  loading: false,
  error: false,
  data: [],
};

describe('Ducks :: tombstone -> reducer', () => {
  it('initialization', () => {
    expect(reducer(undefined, { type: 'init' })).toEqual(TestHooks.loadingState);
  });

  it('error action', () => {
    expect(reducer(state, errorAction)).toEqual(TestHooks.errorState);
  });

  it('loading action', () => {
    expect(reducer(state, loadingAction)).toEqual(TestHooks.loadingState);
  });

  it('success action', () => {
    const expectedState = {
      loading: false,
      error: false,
      data: successAction.payload,
    };
    expect(reducer(state, successAction)).toEqual(expectedState);
  });
});

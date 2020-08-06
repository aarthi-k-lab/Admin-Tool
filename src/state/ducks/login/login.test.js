import { put, take, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as actionTypes from './types';
import { setUserSchemaSuccess, setUserSchemaFailure, setUserSchemaTrigger } from './actions';
import { TestExports } from './sagas';
import { SET_USER_SCHEMA_SAGA, SET_USER_ROLE } from './types';


describe('WatchSetUserSchema', () => {
  const saga = cloneableGenerator(TestExports.watchSetUserSchema)();
  it('watchSetUserSchema should be triggered', () => {
    expect(saga.next().value)
      .toEqual(take(SET_USER_SCHEMA_SAGA));
  });
  it('SetUserSchema should be triggered', () => {
    expect(saga.next({}).value)
      .toEqual(call(TestExports.setUserSchema, {}));
  });
  it('should not call setUserSchema', () => {
    const sagatest = cloneableGenerator(TestExports.watchSetUserSchema)();
    expect(sagatest.next().value)
      .toEqual(take(SET_USER_SCHEMA_SAGA));
    expect(sagatest.next(null).value)
      .toEqual(undefined);
  });
});

describe('User object Save on Login actions', () => {
  it('fails if userObject is not passed', () => {
    const saga = cloneableGenerator(TestExports.setUserSchema)();
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.SET_USER_SCHEMA_FAILED,
        payload: {},
      }));
  });

  it('sets empty userObject if {} is passed', () => {
    const payloadStub = { payload: {} };
    const saga = cloneableGenerator(TestExports.setUserSchema)(payloadStub);
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.SET_USER_SCHEMA_SUCCESS,
        payload: {},
      }));
  });

  it('sets proper userObject if data is passed', () => {
    const payloadStub = {
      payload: {
        userDetails: {
          name: 'Jester_Tester',
        },
      },
    };
    const saga = cloneableGenerator(TestExports.setUserSchema)(payloadStub);
    const sagaValue = saga.next().value;
    expect(sagaValue).toEqual(put({
      type: actionTypes.SET_USER_SCHEMA_SUCCESS,
      payload: payloadStub.payload,
    }));
  });

  it('should trigger the setUserSchemaFailure action', () => {
    const response = setUserSchemaTrigger(actionTypes.SET_USER_SCHEMA_SAGA);
    expect(response.type).toEqual(actionTypes.SET_USER_SCHEMA_SAGA);
  });

  it('should trigger the setUserSchemaFailure action', () => {
    const response = setUserSchemaSuccess(actionTypes.SET_USER_SCHEMA_SUCCESS);
    expect(response.type).toEqual(actionTypes.SET_USER_SCHEMA_SUCCESS);
  });

  it('should trigger the setUserSchemaFailure action', () => {
    const response = setUserSchemaFailure(actionTypes.SET_USER_SCHEMA_FAILED);
    expect(response.type).toEqual(actionTypes.SET_USER_SCHEMA_FAILED);
  });
});
describe('watchSetUserRole', () => {
  const saga = cloneableGenerator(TestExports.watchSetUserRole)();
  it('watchSetUserRole should be triggered', () => {
    expect(saga.next().value)
      .toEqual(take(SET_USER_ROLE));
  });
  it('setUserRole should be triggered', () => {
    expect(saga.next({}).value)
      .toEqual(call(TestExports.setUserRole, {}));
  });
});
describe('watchSetUserRole: null case', () => {
  const saga = cloneableGenerator(TestExports.watchSetUserRole)();
  it('watchSetUserRole should be triggered', () => {
    expect(saga.next().value)
      .toEqual(take(SET_USER_ROLE));
  });
  it('setUserRole should be triggered', () => {
    expect(saga.next(null).value)
      .toEqual(undefined);
  });
});
describe('setUserRole', () => {
  it('should trigger SET_USER_ROLE', () => {
    const saga = cloneableGenerator(TestExports.setUserRole)({ payload: {} });
    expect(saga.next().value)
      .toEqual(put({
        type: actionTypes.SET_USER_ROLE,
        payload: {},
      }));
  });
});

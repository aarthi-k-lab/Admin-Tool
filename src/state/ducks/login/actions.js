import {
  SET_USER_SCHEMA_SAGA,
  SET_USER_SCHEMA_SUCCESS,
  SET_USER_SCHEMA_FAILED,
} from './types';

const setUserSchemaTrigger = userPayload => ({
  type: SET_USER_SCHEMA_SAGA,
  payload: userPayload,
});

const setUserSchemaSuccess = userPayload => ({
  type: SET_USER_SCHEMA_SUCCESS,
  payload: userPayload,
});

const setUserSchemaFailure = () => ({
  type: SET_USER_SCHEMA_FAILED,
  payload: [],
});

export {
  setUserSchemaTrigger,
  setUserSchemaSuccess,
  setUserSchemaFailure,
};

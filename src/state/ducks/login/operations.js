import { setUserSchemaTrigger as setUserSchemaAction } from './actions';

const setUserSchemaTrigger = dispatch => (userPayload) => {
  dispatch(setUserSchemaAction(userPayload));
};

const operations = {
  setUserSchemaTrigger,
};

export default operations;

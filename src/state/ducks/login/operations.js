import { setUserSchemaTrigger as setUserSchemaAction, setUserRole as setUserRoleAction } from './actions';

const setUserSchemaTrigger = dispatch => (userPayload) => {
  dispatch(setUserSchemaAction(userPayload));
};

const setUserRole = dispatch => (role) => {
  dispatch(setUserRoleAction(role));
};
const operations = {
  setUserSchemaTrigger,
  setUserRole,
};

export default operations;

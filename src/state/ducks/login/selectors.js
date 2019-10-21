import * as R from 'ramda';

const getUser = state => state.user;
const getGroups = state => (state.user && state.user.group ? state.user.group : []);

const getUserRole = state => R.pathOr('Agent', ['user', 'role'], state);

const getGroupList = R.pathOr([], ['user', 'groupList']);

const selectors = {
  getUser,
  getUserRole,
  getGroupList,
  getGroups,
};

export default selectors;

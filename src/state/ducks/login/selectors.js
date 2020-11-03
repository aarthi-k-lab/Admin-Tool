import * as R from 'ramda';

const getUser = state => state.user;
const getGroups = state => (state.user && state.user.group ? state.user.group : []);

const getUserRole = state => R.pathOr('Agent', ['user', 'role'], state);

const getGroupList = R.pathOr([], ['user', 'groupList']);

const isUtilGroupPresent = state => getGroupList(state).includes('util-mgr');

const selectors = {
  isUtilGroupPresent,
  getUser,
  getUserRole,
  getGroupList,
  getGroups,
};

export default selectors;

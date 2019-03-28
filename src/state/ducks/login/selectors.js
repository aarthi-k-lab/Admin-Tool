import * as R from 'ramda';

const getUser = state => state.user;
const getGroups = state => (state.user && state.user.group ? state.user.group : []);

const getGroupList = R.pathOr([], ['user', 'groupList']);

const selectors = {
  getUser,
  getGroupList,
  getGroups,
};

export default selectors;

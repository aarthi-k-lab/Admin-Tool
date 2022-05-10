import * as R from 'ramda';
import { RPS_STAGER, RPS_STAGER_MGR } from 'constants/Groups';

const getUser = state => state.user;
const getGroups = state => (state.user && state.user.group ? state.user.group : []);

const getUserRole = state => R.pathOr('Agent', ['user', 'role'], state);

const getGroupList = R.pathOr([], ['user', 'groupList']);

const isUtilGroupPresent = state => getGroupList(state).includes('util-mgr');

const isRPSGroupPresent = state => getGroupList(state).includes(RPS_STAGER)
  || getGroupList(state).includes(RPS_STAGER_MGR);

const selectors = {
  isUtilGroupPresent,
  isRPSGroupPresent,
  getUser,
  getUserRole,
  getGroupList,
  getGroups,
};

export default selectors;

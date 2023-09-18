import * as R from 'ramda';
import {
  RPS_STAGER, RPS_STAGER_MGR, RSH_STAGER, RSH_STAGER_MGR,
} from 'constants/Groups';

const getUser = state => state.user;
const getGroups = state => (state.user && state.user.group ? state.user.group : []);

const getUserRole = state => R.pathOr('Agent', ['user', 'role'], state);

const getGroupList = R.pathOr([], ['user', 'groupList']);

const isUtilGroupPresent = state => getGroupList(state).includes('util-mgr');

const getUserPrincipalName = state => R.path(['user', 'userDetails', 'email'], state);
const isRPSGroupPresent = state => getGroupList(state).includes(RPS_STAGER)
  || getGroupList(state).includes(RPS_STAGER_MGR);
const getUserFullName = state => R.path(['user', 'userDetails', 'name'], state);

const isRSHGroupPresent = state => getGroupList(state).includes(RSH_STAGER)
|| getGroupList(state).includes(RSH_STAGER_MGR);

const selectors = {
  getUserPrincipalName,
  isUtilGroupPresent,
  isRPSGroupPresent,
  getUser,
  getUserRole,
  getGroupList,
  getGroups,
  getUserFullName,
  isRSHGroupPresent,
};

export default selectors;

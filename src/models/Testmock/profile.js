const userGroups = [{
  groupName: 'docgenvendor',
}, {
  groupName: 'docgenvendor-mgr',
}, {
  groupName: 'booking',
}, {
  groupName: 'booking-mgr',
}, {
  groupName: 'docsin',
}, {
  groupName: 'docsin-mgr',
}, {
  groupName: 'docgen',
}, {
  groupName: 'docgen-mgr',
}, {
  groupName: 'stager',
}, {
  groupName: 'stager-mgr',
}, {
  groupName: 'proc',
}, {
  groupName: 'proc-mgr',
}, {
  groupName: 'beuw',
}, {
  groupName: 'beuw-mgr',
}, {
  groupName: 'feuw',
}, {
  groupName: 'feuw-mgr',
}, {
  groupName: 'trial',
}, {
  groupName: 'trial-mgr',
}, {
  groupName: 'postmodstager',
}, {
  groupName: 'postmodstager-mgr',
}, {
  groupName: 'util',
}, {
  groupName: 'util-mgr',
}, {
  groupName: 'beta',
}];


const userGroupsUncheckedAgent = [{
  groupName: 'docsin',
}, {
  groupName: 'docgen',
}, {
  groupName: 'stager',
}, {
  groupName: 'proc',
}, {
  groupName: 'beuw',
}, {
  groupName: 'feuw',
}, {
  groupName: 'trial',
}, {
  groupName: 'util',
}];

const userGroupsUncheckedManager = [{
  groupName: 'docsin-mgr',
}, {
  groupName: 'docgen-mgr',
}, {
  groupName: 'stager-mgr',
}, {
  groupName: 'proc-mgr',
}, {
  groupName: 'beuw-mgr',
}, {
  groupName: 'feuw-mgr',
}, {
  groupName: 'trial-mgr',
}, {
  groupName: 'util-mgr',
}];

const isChecked = {
  PROC: true,
  FEUW: true,
  BEUW: true,
  DOCGEN: true,
  DOCSIN: true,
  BETA: true,
  STAGER: true,
  TRIAL: true,
  UTIL: true,
  POSTMODSTAGER: true,
  BOOKING: true,
  DOCGENVENDOR: true,
  FHLMCRESOLVE: true,
};

const isCheckedFalse = {
  PROC: true,
  FEUW: true,
  BEUW: true,
  DOCGEN: true,
  DOCSIN: true,
  BETA: false,
  STAGER: true,
  TRIAL: true,
  UTIL: true,
  POSTMODSTAGER: false,
  BOOKING: false,
  DOCGENVENDOR: false,
  FHLMCRESOLVE: true,
};
const skills = { FEUW: ['Skill14::InVESTOR', 'Skill19::MRC Onshore', 'Skill1::something', 'Skill2::nothing'] };


module.exports = {
  userGroups,
  isChecked,
  skills,
  isCheckedFalse,
  userGroupsUncheckedAgent,
  userGroupsUncheckedManager,
};

const R = require('ramda');

const managerDashboard = {
  path: '/reports',
  name: 'dashboard',
  img: '/static/img/icon-dashboard.png',
  groups: ['feuw-mgr', 'beuw-mgr'],
};

const stager = {
  path: '/stager',
  name: 'stager',
  img: '/static/img/stager.svg',
  groups: ['feuw-mgr', 'beuw-mgr', 'stager', 'stager-mgr'],
};

const links = [
  managerDashboard,
  {
    path: '/loan-evaluation',
    name: 'loan-evaluation',
    img: '/static/img/frontend.svg',
    groups: ['feuw', 'feuw-mgr'],
  },
  stager,
  {
    path: '/move-forward',
    name: 'move-forward',
    img: '/static/img/move_forward.svg',
    groups: ['feuw-mgr', 'beuw-mgr'],
  },
];

function getSafeGroups(groups) {
  return R.is(Array, groups) ? groups : [];
}

function hasManagerDashboardAccess(groups) {
  const safeGroups = getSafeGroups(groups);
  return managerDashboard.groups.some(managerGroup => safeGroups.includes(managerGroup));
}

function hasStagerDashboardAccess(groups) {
  const safeGroups = getSafeGroups(groups);
  return stager.groups.some(stagerGroup => safeGroups.includes(stagerGroup));
}

module.exports = {
  links,
  hasManagerDashboardAccess,
  hasStagerDashboardAccess,
};


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

function hasManagerDashboardAccess(groups) {
  return managerDashboard.groups.some(managerGroup => groups.includes(managerGroup));
}

function hasStagerDashboardAccess(groups) {
  return stager.groups.some(stagerGroup => groups.includes(stagerGroup));
}

module.exports = {
  links,
  hasManagerDashboardAccess,
  hasStagerDashboardAccess,
};

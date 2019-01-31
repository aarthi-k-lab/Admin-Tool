import { hasManagerDashboardAccess, hasStagerDashboardAccess, links } from './RouteAccess';

describe('hasManagerDashboardAccess should return appropriate access', () => {
  it('hasManagerDashboardAccess should return true', () => {
    const groups = 'mgr';
    const result = hasManagerDashboardAccess(groups);
    expect(result).toEqual(true);
  });
  it('hasManagerDashboardAccess should return true', () => {
    const groups = ['feuw-mgr'];
    const result = hasManagerDashboardAccess(groups);
    expect(result).toEqual(true);
  });
});

describe('hasStagerDashboardAccess should return appropriate access', () => {
  it('hasStagerDashboardAccess should return true', () => {
    const groups = 'mgr';
    const result = hasStagerDashboardAccess(groups);
    expect(result).toEqual(true);
  });
  it('hasStagerDashboardAccess should return true if group matches', () => {
    const groups = ['stager'];
    const result = hasStagerDashboardAccess(groups);
    expect(result).toEqual(true);
  });
});


describe('All personas exists', () => {
  it('Backendunderwriter feature icon exists', () => {
    expect(links[2].groups[0]).toEqual('beuw');
  });
});

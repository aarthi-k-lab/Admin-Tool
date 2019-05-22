import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerDashboard';

describe('<StagerDashboard />', () => {
  it('shows StagerPage', () => {
    const getDashboardCounts = jest.fn();
    const triggerStagerValue = jest.fn();
    const groups = ['feuw-mgr', 'beuw-mgr', 'stager', 'stager-mgr'];
    const wrapper = shallow(
      <TestExports.StagerDashboard
        getDashboardCounts={getDashboardCounts}
        groups={groups}
        triggerStagerValue={triggerStagerValue}
      />,
    );
    console.debug('wrapper>>>', wrapper);
    expect(wrapper).toHaveLength(1);
  });
});

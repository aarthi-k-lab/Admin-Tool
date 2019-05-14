import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './StagerDashboard';

describe('<StagerDashboard />', () => {
  it('shows StagerPage', () => {
    const getDashboardCounts = jest.fn();
    const wrapper = shallow(
      <TestExports.StagerDashboard getDashboardCounts={getDashboardCounts} />,
    );
    expect(wrapper.find('StagerPage')).toHaveLength(1);
  });
});

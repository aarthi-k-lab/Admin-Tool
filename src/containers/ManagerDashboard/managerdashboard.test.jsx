import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './ManagerDashboard';

describe('<ManagerDashboard >', () => {
  const fetchPowerBIConstants = jest.fn();
  it('should render ManagerDashboard', () => {
    const props = {
      fetchPowerBIConstants,
    };
    const handleChange = jest.spyOn(TestHooks.ManagerDashboard.prototype, 'handleChange');
    const wrapper = shallow(
      <TestHooks.ManagerDashboard {...props} />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
    wrapper.find('DropDownSelect').simulate('change', { target: {} });
    expect(handleChange).toHaveBeenCalled();
  });
});

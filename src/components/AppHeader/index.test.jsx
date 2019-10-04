import React from 'react';
import { shallow } from 'enzyme';
import { TestExports } from './Header';


describe('<Header />', () => {
  const user = {
    userDetails: {
      email: 'brent@mrcooper.com',
      jobTitle: 'developer',
      name: 'brent',
    },
  };
  const setUserRole = jest.fn();
  const getFeatures = {
    userGroupsToggle: true,
  };
  it('shows Header', () => {
    const wrapper = shallow(
      <TestExports.Header getFeatures={getFeatures} setUserRole={setUserRole} user={user} />,
    );
    expect(wrapper.find('Link')).toHaveLength(1);
    expect(wrapper.find('WithStyles(ForwardRef(IconButton))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('Click');
    expect(wrapper.instance().state.showProfileDetails).toBe(true);
    wrapper.instance().handleProfileClose();
    expect(wrapper.instance().state.showProfileDetails).toBe(false);
  });
});

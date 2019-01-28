import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe('<Header />', () => {
  const user = {
    userDetails: {
      email: 'brent@mrcooper.com',
      jobTitle: 'developer',
      name: 'brent',
    },
  };

  it('shows Header', () => {
    const wrapper = shallow(
      <Header user={user} />,
    );
    expect(wrapper.find('Link')).toHaveLength(1);
    expect(wrapper.find('WithStyles(IconButton)')).toHaveLength(1);
    wrapper.find('WithStyles(IconButton)').simulate('Click');
    expect(wrapper.instance().state.showProfileDetails).toBe(true);
    wrapper.instance().handleProfileClose();
    expect(wrapper.instance().state.showProfileDetails).toBe(false);
  });
});

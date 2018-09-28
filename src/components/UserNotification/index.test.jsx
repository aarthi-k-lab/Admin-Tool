import React from 'react';
import { shallow } from 'enzyme';
import UserNotification from '.';

describe('<UserNotification />', () => {
  it('should render the UserNotification component', () => {
    const wrapper = shallow(<UserNotification level="error" message="Please retry" type="alert-box" />);
    expect(wrapper.find('AlertBox')).toHaveLength(1);
  });
});

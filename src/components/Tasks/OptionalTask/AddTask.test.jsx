import React from 'react';
import { shallow } from 'enzyme';
import AddTask from './AddTask';

describe('<Tabs />', () => {
  it('should render the AddTask component', () => {
    const wrapper = shallow(
      <AddTask />,
    );
    expect(wrapper.find('AddTask')).toHaveLength(1);
  });
});

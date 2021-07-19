import React from 'react';
import { shallow } from 'enzyme';
import AddTask from './AddTask';

const props = {
  classes: {},
};
describe('<Tabs />', () => {
  it('should render the AddTask component', () => {
    const wrapper = shallow(
      <AddTask {...props} />,
    );
    expect(wrapper.find('AddTask')).toHaveLength(1);
  });
});

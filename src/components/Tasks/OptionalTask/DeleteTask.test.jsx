import React from 'react';
import { shallow } from 'enzyme';
import DeleteTask from './DeleteTask';

const props = {
  classes: {},
  disabled: false,
};
describe('<Tabs />', () => {
  it('should render the DeleteTask component', () => {
    const wrapper = shallow(
      <DeleteTask {...props} />,
    );
    expect(wrapper.find('DeleteTask')).toHaveLength(1);
  });
});

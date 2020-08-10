import React from 'react';
import { shallow } from 'enzyme';
import DeleteTask from './DeleteTask';

describe('<Tabs />', () => {
  it('should render the DeleteTask component', () => {
    const wrapper = shallow(
      <DeleteTask />,
    );
    expect(wrapper.find('DeleteTask')).toHaveLength(1);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './TaskPane';

describe('<TombstoneWrapper />', () => {
  it('shows TaskPane', () => {
    const wrapper = shallow(
      <TestHooks.TaskPane getTasks={() => {}} isAccessible />,
    );
    expect(wrapper.find('LeftTaskPane')).toHaveLength(1);
  });
  it('does not show TaskPane', () => {
    const wrapper = shallow(
      <TestHooks.TaskPane getTasks={() => {}} />,
    );
    expect(wrapper.find('LeftTaskPane')).toHaveLength(0);
  });
});

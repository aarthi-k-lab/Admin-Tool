import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './TaskPane';

describe('<TombstoneWrapper />', () => {
  it('shows TaskPane', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(
      <TestHooks.TaskPane fetchPdfGeneratorUrl={handleClick} getTasks={() => {}} isAccessible />,
    );
    expect(wrapper.find('LeftTaskPane')).toHaveLength(1);
  });
});

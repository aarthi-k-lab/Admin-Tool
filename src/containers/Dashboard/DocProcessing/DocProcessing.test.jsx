import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './DocProcessing';

describe('<DocProcessing />', () => {
  it('shows DocProcessing widget in Loading mode', () => {
    const { DocProcessing } = TestHooks;
    const wrapper = shallow(
      <DocProcessing />,
    );
    expect(wrapper).toHaveLength(1);
  });
});

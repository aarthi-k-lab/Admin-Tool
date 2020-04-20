import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './SubmitFileError';

describe('renders <SubmitFileError />', () => {
  it('renders icon and error message successfully', () => {
    const wrapper = shallow(
      <TestHooks.SubmitFileError />,
    );
    expect(wrapper.find('div')).toHaveLength(1);
  });
});

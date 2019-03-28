import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './BackEndDisposition';

describe('<Backend Disposition />', () => {
  it('shows Backend Disposition widget in Loading mode', () => {
    const { BackEndDisposition } = TestHooks;
    const wrapper = shallow(
      <BackEndDisposition />,
    );
    expect(wrapper).toHaveLength(1);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './LoanActivity';

describe('<LoanActivity />', () => {
  it('shows Trial widget in Loading mode', () => {
    const { LoanActivity } = TestHooks;
    const wrapper = shallow(
      <LoanActivity />,
    );
    const grid = wrapper.find('div');
    expect(grid).toHaveLength(2);
  });
});

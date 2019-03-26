import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './LoanActivity';

describe('<LoanActivity />', () => {
  it('shows Trail widget in Loading mode', () => {
    const { LoanActivity } = TestHooks;
    const onSearchLoan = jest.fn();
    const onSelectEval = jest.fn();
    const wrapper = shallow(
      <LoanActivity onSearchLoan={onSearchLoan} onSelectEval={onSelectEval} />,
    );
    const grid = wrapper.find('div');
    expect(grid).toHaveLength(3);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './Trail';

describe('<Trail />', () => {
  it('shows Trail widget in Loading mode', () => {
    const { Trail } = TestHooks;
    const onSearchLoan = jest.fn();
    const onSelectEval = jest.fn();
    const wrapper = shallow(
      <Trail onSearchLoan={onSearchLoan} onSelectEval={onSelectEval} />,
    );
    const grid = wrapper.find('div');
    expect(grid).toHaveLength(3);
  });
});

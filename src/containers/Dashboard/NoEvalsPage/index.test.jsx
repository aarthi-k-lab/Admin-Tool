import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './NoEvalsPage';

describe('<NoEvalsPage />', () => {
  const { NoEvalsPage } = TestHooks;
  it('should display NoEvalsPage', () => {
    const wrapper = shallow(<NoEvalsPage loanNumber={12345} />);
    expect(wrapper.find('FullHeightColumn')).toHaveLength(1);
    expect(wrapper.find('h3')).toHaveLength(1);
    expect(wrapper.find('span').text()).toBe('Loan Number "12345" still exists');
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
  });
});

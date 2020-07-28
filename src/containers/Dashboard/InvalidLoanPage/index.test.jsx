import React from 'react';
import { shallow } from 'enzyme';
import { TestHooks } from './InvalidLoanPage';

describe('<InvalidLoanPage />', () => {
  const { InvalidLoanPage } = TestHooks;
  it('should display service down when 404 occurs', () => {
    const wrapper = shallow(<InvalidLoanPage loanNumber={404} />);
    expect(wrapper.find('FullHeightColumn')).toHaveLength(1);
    expect(wrapper.find('h3')).toHaveLength(1);
    expect(wrapper.find('span').text()).toBe('Service Down. Please retry after sometime...!');
  });
  it('should display error message when 404 occurs doesnt occur', () => {
    const wrapper = shallow(<InvalidLoanPage loanNumber={204} />);
    expect(wrapper.find('FullHeightColumn')).toHaveLength(1);
    expect(wrapper.find('h3')).toHaveLength(1);
    expect(wrapper.find('span').text()).toBe('We did not find any matches for "204". Try searching with a valid loan number.');
  });
});

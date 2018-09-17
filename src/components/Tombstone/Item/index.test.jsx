import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Item from '.';

describe('<Item />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<Item />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('contains default title and content when no props are passed', () => {
    const wrapper = shallow(<Item />);
    expect(wrapper.find('div').containsAllMatchingElements([
      <span>title</span>,
      <span>content</span>,
    ])).toBe(true);
  });

  test('contains title and content which are passes as props', () => {
    const wrapper = shallow(<Item content="Loan" title="9876543" />);
    expect(wrapper.find('div').containsAllMatchingElements([
      <span>Loan</span>,
      <span>9876543</span>,
    ])).toBe(true);
  });
});

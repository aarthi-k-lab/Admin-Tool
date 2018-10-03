import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Expand from '.';

describe('<Expand />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<Expand />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('triggers onClick handler', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<Expand onClick={handleClick} />);
    wrapper.simulate('click');
    expect(handleClick.mock.calls.length).toBe(1);
  });
});

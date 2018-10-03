import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import GetNext from '.';

describe('<GetNext />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<GetNext />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('triggers onClick handler', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<GetNext onClick={handleClick} />);
    wrapper.simulate('click');
    expect(handleClick.mock.calls.length).toBe(1);
  });
});

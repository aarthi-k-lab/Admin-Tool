import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import EndShift from '.';

describe('<EndShift />', () => {
  test('snapshot test', () => {
    const tree = renderer
      .create(<EndShift />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('triggers onClick handler', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<EndShift onClick={handleClick} />);
    wrapper.simulate('click');
    expect(handleClick.mock.calls.length).toBe(1);
  });
});

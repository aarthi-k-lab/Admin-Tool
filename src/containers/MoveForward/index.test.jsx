import React from 'react';
import { shallow } from 'enzyme';
import MoveForward from '.';

describe('<MoveForward />', () => {
  it('should render MoveForward component', () => {
    const handleChange = jest.spyOn(MoveForward.prototype, 'handleChange');
    // const moveForward = jest.spyOn(MoveForward.prototype, 'moveForward');
    const wrapper = shallow(
      <MoveForward />,
    );
    expect(wrapper.find('Fragment')).toHaveLength(1);
    wrapper.find('Filters').simulate('change', { target: {} });
    expect(handleChange).toBeCalled();
    // wrapper.setState({ pids: '' });
    // wrapper.find('Filters').simulate('click');
    // expect(moveForward).toBeCalled();
  });
});

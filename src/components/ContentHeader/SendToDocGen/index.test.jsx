import React from 'react';
import { shallow } from 'enzyme';
import SendToDocGen from '.';

describe('<SendToDocGen  >', () => {
  it('should render the SendToDocGen  component', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<SendToDocGen onClick={onClick} />);
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onClick).toBeCalled();
  });
});

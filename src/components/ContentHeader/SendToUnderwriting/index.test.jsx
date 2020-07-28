import React from 'react';
import { shallow } from 'enzyme';
import SendToUnderwriting from '.';

describe('<SendToUnderwriting >', () => {
  it('should render the SendToUnderwriting component', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<SendToUnderwriting onClick={onClick} />);
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onClick).toBeCalled();
  });
});

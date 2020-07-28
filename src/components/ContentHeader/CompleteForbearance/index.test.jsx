import React from 'react';
import { shallow } from 'enzyme';
import CompleteForbearance from '.';

describe('<CompleteForbearance >', () => {
  it('should render the CompleteForbearance component', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<CompleteForbearance onClick={onClick} />);
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onClick).toBeCalled();
  });
});

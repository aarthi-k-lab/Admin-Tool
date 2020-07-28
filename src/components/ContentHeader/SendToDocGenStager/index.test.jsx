import React from 'react';
import { shallow } from 'enzyme';
import SendToDocGenStager from '.';

describe('<SendToDocGenStager   >', () => {
  it('should render the SendToDocGenStager   component', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<SendToDocGenStager onClick={onClick} />);
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onClick).toBeCalled();
  });
});

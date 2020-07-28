import React from 'react';
import { shallow } from 'enzyme';
import SendToDocsIn from '.';

describe('<SendToDocsIn    >', () => {
  it('should render the SendToDocsIn    component', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<SendToDocsIn onClick={onClick} />);
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onClick).toBeCalled();
  });
});

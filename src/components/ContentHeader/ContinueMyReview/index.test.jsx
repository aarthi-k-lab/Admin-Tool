import React from 'react';
import { shallow } from 'enzyme';
import ContinueMyReview from '.';

describe('<ContinueMyReview  >', () => {
  it('should render the ContinueMyReview  component', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<ContinueMyReview onClick={onClick} />);
    expect(wrapper.find('WithStyles(ForwardRef(Button))')).toHaveLength(1);
    wrapper.find('WithStyles(ForwardRef(Button))').at(0).simulate('click');
    expect(onClick).toBeCalled();
  });
});

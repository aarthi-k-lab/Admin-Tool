import React from 'react';
import { shallow } from 'enzyme';
import DialogBox from '.';

describe('<DialogBox>', () => {
  it('should render the DialogBox component', () => {
    const props = {
      message: 'mock',
      onClose: jest.fn(),
    };
    const wrapper = shallow(
      <DialogBox {...props} />,
    );
    expect(wrapper.find('WithStyles(ForwardRef(Dialog))')).toHaveLength(1);
  });
});
